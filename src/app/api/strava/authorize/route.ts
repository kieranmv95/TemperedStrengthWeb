import { randomUUID } from "crypto";
import {
  getStravaClientId,
  getStravaRedirectUri,
  isStravaConfigured,
  STRAVA_AUTHORIZE_URL,
} from "@/lib/strava/config";
import { configurationError } from "@/lib/strava/errors";
import { buildReturnUrl, isAllowedReturnTo } from "@/lib/strava/return-to";
import { savePendingOAuth } from "@/lib/strava/storage";

export async function GET(request: Request) {
  if (!isStravaConfigured()) {
    return configurationError();
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo")?.trim();

  if (!returnTo) {
    return Response.json(
      { error: "returnTo query parameter is required." },
      { status: 400 }
    );
  }

  if (!isAllowedReturnTo(returnTo)) {
    return Response.json(
      { error: "returnTo is not an allowed redirect target." },
      { status: 400 }
    );
  }

  const linkId = randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await savePendingOAuth({ linkId, returnTo, createdAt });
  } catch {
    return Response.json(
      { error: "Could not start Strava authorization." },
      { status: 503 }
    );
  }

  const authorizeUrl = new URL(STRAVA_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", getStravaClientId());
  authorizeUrl.searchParams.set("redirect_uri", getStravaRedirectUri());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "activity:read_all");
  authorizeUrl.searchParams.set("state", linkId);

  return Response.redirect(authorizeUrl.toString(), 302);
}
