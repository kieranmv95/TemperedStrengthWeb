import { isStravaConfigured } from "@/lib/strava/config";
import { exchangeAuthorizationCode } from "@/lib/strava/client";
import { configurationError } from "@/lib/strava/errors";
import { buildReturnUrl } from "@/lib/strava/return-to";
import {
  deletePendingOAuth,
  getPendingOAuth,
  saveOAuthTokens,
} from "@/lib/strava/storage";

function errorPage(message: string): Response {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Strava connection</title></head><body><p>${message}</p></body></html>`,
    { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: Request) {
  if (!isStravaConfigured()) {
    return configurationError();
  }

  const { searchParams } = new URL(request.url);
  const oauthError = searchParams.get("error");
  const code = searchParams.get("code");
  const linkId = searchParams.get("state");

  if (!linkId) {
    return errorPage("Missing OAuth state. Please try connecting again from the app.");
  }

  const pending = await getPendingOAuth(linkId);
  if (!pending) {
    return errorPage(
      "This connection link has expired. Open Tempered Strength and connect Strava again."
    );
  }

  const { returnTo } = pending;

  if (oauthError) {
    await deletePendingOAuth(linkId);
    return Response.redirect(
      buildReturnUrl(returnTo, { error: oauthError }),
      302
    );
  }

  if (!code) {
    return Response.redirect(
      buildReturnUrl(returnTo, { error: "missing_code" }),
      302
    );
  }

  try {
    const tokenResponse = await exchangeAuthorizationCode(code);

    await saveOAuthTokens({
      linkId,
      stravaAthleteId: tokenResponse.athlete.id,
      refreshToken: tokenResponse.refresh_token,
      accessToken: tokenResponse.access_token,
      accessTokenExpiresAt: tokenResponse.expires_at,
      createdAt: new Date().toISOString(),
    });

    await deletePendingOAuth(linkId);

    return Response.redirect(
      buildReturnUrl(returnTo, { linkId }),
      302
    );
  } catch (err) {
    await deletePendingOAuth(linkId);
    const message =
      err instanceof Error ? err.message : "token_exchange_failed";
    return Response.redirect(
      buildReturnUrl(returnTo, { error: message }),
      302
    );
  }
}
