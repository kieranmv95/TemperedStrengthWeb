import { randomUUID } from "crypto";
import { isStravaConfigured } from "@/lib/strava/config";
import { configurationError } from "@/lib/strava/errors";
import {
  deleteOAuthTokens,
  getOAuthTokens,
  saveDeviceRecord,
} from "@/lib/strava/storage";

export async function POST(request: Request) {
  if (!isStravaConfigured()) {
    return configurationError();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const linkId =
    body &&
    typeof body === "object" &&
    "linkId" in body &&
    typeof (body as { linkId: unknown }).linkId === "string"
      ? (body as { linkId: string }).linkId.trim()
      : "";

  if (!linkId) {
    return Response.json({ error: "linkId is required." }, { status: 400 });
  }

  const tokens = await getOAuthTokens(linkId);
  if (!tokens) {
    return Response.json(
      { error: "Unknown or expired linkId." },
      { status: 404 }
    );
  }

  const deviceToken = randomUUID();
  const now = new Date().toISOString();

  await saveDeviceRecord({
    deviceToken,
    stravaAthleteId: tokens.stravaAthleteId,
    refreshToken: tokens.refreshToken,
    accessToken: tokens.accessToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt,
    createdAt: now,
    updatedAt: now,
  });

  await deleteOAuthTokens(linkId);

  return Response.json({ deviceToken });
}
