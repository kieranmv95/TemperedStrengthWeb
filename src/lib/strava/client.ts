import {
  getStravaClientId,
  getStravaClientSecret,
  STRAVA_API_BASE,
  STRAVA_DEAUTHORIZE_URL,
  STRAVA_TOKEN_URL,
} from "./config";
import type { StravaApiTracker } from "./api-metrics";

export type StravaTokenResponse = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: { id: number };
};

export type StravaBestEffort = {
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date?: string;
};

export type StravaActivitySummary = {
  id: number;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  /** Present on some list payloads; usually only on detailed activities. */
  best_efforts?: StravaBestEffort[];
};

export type StravaActivityDetail = StravaActivitySummary;

class StravaApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "StravaApiError";
  }
}

async function parseStravaError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

function trackRateLimit(res: Response, tracker?: StravaApiTracker): void {
  if (!tracker) return;
  const usage =
    res.headers.get("X-RateLimit-Usage") ??
    res.headers.get("x-ratelimit-usage");
  tracker.setRateLimitUsage(usage);
}

export async function exchangeAuthorizationCode(
  code: string
): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: getStravaClientId(),
      client_secret: getStravaClientSecret(),
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    throw new StravaApiError(await parseStravaError(res), res.status);
  }

  return res.json() as Promise<StravaTokenResponse>;
}

export async function refreshAccessToken(
  refreshToken: string,
  tracker?: StravaApiTracker
): Promise<StravaTokenResponse> {
  if (tracker) tracker.apiCalls++;

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: getStravaClientId(),
      client_secret: getStravaClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  trackRateLimit(res, tracker);

  if (!res.ok) {
    throw new StravaApiError(await parseStravaError(res), res.status);
  }

  return res.json() as Promise<StravaTokenResponse>;
}

export async function deauthorizeAthlete(
  accessToken: string
): Promise<void> {
  const res = await fetch(STRAVA_DEAUTHORIZE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });
  if (!res.ok && res.status !== 401) {
    throw new StravaApiError(await parseStravaError(res), res.status);
  }
}

async function stravaFetch<T>(
  path: string,
  accessToken: string,
  tracker?: StravaApiTracker,
  init?: RequestInit
): Promise<T> {
  if (tracker) tracker.apiCalls++;

  const res = await fetch(`${STRAVA_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });

  trackRateLimit(res, tracker);

  if (!res.ok) {
    throw new StravaApiError(await parseStravaError(res), res.status);
  }

  return res.json() as Promise<T>;
}

export async function listAthleteActivities(
  accessToken: string,
  options: { page: number; perPage?: number; after?: number },
  tracker?: StravaApiTracker
): Promise<StravaActivitySummary[]> {
  const params = new URLSearchParams({
    page: String(options.page),
    per_page: String(options.perPage ?? 200),
  });
  if (options.after != null) {
    params.set("after", String(options.after));
  }

  tracker?.recordListPage();

  return stravaFetch<StravaActivitySummary[]>(
    `/athlete/activities?${params}`,
    accessToken,
    tracker
  );
}

export async function getActivityDetail(
  accessToken: string,
  activityId: number,
  tracker?: StravaApiTracker
): Promise<StravaActivityDetail> {
  tracker?.recordDetailFetch();

  return stravaFetch<StravaActivityDetail>(
    `/activities/${activityId}`,
    accessToken,
    tracker
  );
}

export { StravaApiError };
