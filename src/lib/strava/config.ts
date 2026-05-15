const DEFAULT_REDIRECT_URI =
  "https://www.temperedstrength.com/api/strava/callback";

const DEFAULT_ALLOWED_RETURN_TO = ["temperedstrengthapp://strava"];

export function getStravaClientId(): string {
  const id = process.env.STRAVA_CLIENT_ID;
  if (!id) throw new Error("STRAVA_CLIENT_ID is not configured");
  return id;
}

export function getStravaClientSecret(): string {
  const secret = process.env.STRAVA_CLIENT_SECRET;
  if (!secret) throw new Error("STRAVA_CLIENT_SECRET is not configured");
  return secret;
}

export function getStravaRedirectUri(): string {
  return process.env.STRAVA_REDIRECT_URI ?? DEFAULT_REDIRECT_URI;
}

export function getAllowedReturnToUrls(): string[] {
  const extra = process.env.STRAVA_ALLOWED_RETURN_TO;
  if (!extra?.trim()) return DEFAULT_ALLOWED_RETURN_TO;
  return [
    ...DEFAULT_ALLOWED_RETURN_TO,
    ...extra.split(",").map((s) => s.trim()).filter(Boolean),
  ];
}

export function isStravaConfigured(): boolean {
  return Boolean(
    process.env.STRAVA_CLIENT_ID &&
      process.env.STRAVA_CLIENT_SECRET &&
      process.env.STRAVA_TOKEN_ENCRYPTION_KEY
  );
}

export const STRAVA_AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
export const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
export const STRAVA_API_BASE = "https://www.strava.com/api/v3";
export const STRAVA_DEAUTHORIZE_URL = "https://www.strava.com/oauth/deauthorize";

export const PENDING_OAUTH_TTL_SECONDS = 600;
export const SYNC_RATE_LIMIT_SECONDS = 60;
export const SYNC_MAX_ACTIVITY_PAGES = 10;
export const SYNC_MAX_ACTIVITY_AGE_MS = 2 * 365 * 24 * 60 * 60 * 1000;
export const SYNC_MAX_DETAIL_FETCHES = 80;
