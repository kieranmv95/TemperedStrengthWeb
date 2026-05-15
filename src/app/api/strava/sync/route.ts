import { createStravaApiTracker, logSyncMetrics } from "@/lib/strava/api-metrics";
import { ensureFreshAccessToken, resolveDeviceToken } from "@/lib/strava/auth";
import { isStravaConfigured } from "@/lib/strava/config";
import {
  configurationError,
  jsonError,
  stravaUpstreamResponse,
} from "@/lib/strava/errors";
import {
  getDeviceSyncState,
  isSyncRateLimited,
  saveDeviceSyncState,
  setLastSyncAt,
} from "@/lib/strava/storage";
import { buildSyncPayload } from "@/lib/strava/sync";

export async function POST(request: Request) {
  if (!isStravaConfigured()) {
    return configurationError();
  }

  const record = await resolveDeviceToken(request);
  if (!record) {
    return jsonError("Missing or invalid device token.", 401);
  }

  if (await isSyncRateLimited(record.deviceToken)) {
    return jsonError("Sync too soon. Try again in a minute.", 429);
  }

  const tracker = createStravaApiTracker();

  try {
    const { accessToken } = await ensureFreshAccessToken(record, tracker);
    const syncState = await getDeviceSyncState(record.deviceToken);
    const { payload, metrics, nextSyncState } = await buildSyncPayload(
      accessToken,
      record.deviceToken,
      syncState,
      tracker
    );

    await saveDeviceSyncState(nextSyncState);
    await setLastSyncAt(record.deviceToken);

    logSyncMetrics(record.deviceToken, metrics);

    const headers: HeadersInit = {};
    if (process.env.NODE_ENV !== "production") {
      headers["X-Strava-Api-Calls"] = String(metrics.apiCalls);
    }

    return Response.json(payload, { headers });
  } catch (err) {
    return stravaUpstreamResponse(err);
  }
}
