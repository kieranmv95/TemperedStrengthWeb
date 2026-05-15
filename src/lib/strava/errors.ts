import { StravaApiError } from "./client";

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export function stravaUpstreamResponse(err: unknown): Response {
  if (err instanceof StravaApiError) {
    return jsonError(`Strava API error: ${err.message}`, 502);
  }
  if (err instanceof Error) {
    return jsonError(err.message, 502);
  }
  return jsonError("Strava upstream failure", 502);
}

export function configurationError(): Response {
  return jsonError("Strava integration is not configured.", 503);
}
