import { ensureFreshAccessToken, resolveDeviceToken } from "@/lib/strava/auth";
import { isStravaConfigured } from "@/lib/strava/config";
import {
  configurationError,
  jsonError,
  stravaUpstreamResponse,
} from "@/lib/strava/errors";
import {
  isSyncRateLimited,
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
    return jsonError(
      "Sync rate limit exceeded. Please wait at least 60 seconds between syncs.",
      429
    );
  }

  try {
    const { accessToken } = await ensureFreshAccessToken(record);
    const payload = await buildSyncPayload(accessToken);
    await setLastSyncAt(record.deviceToken);
    return Response.json(payload);
  } catch (err) {
    return stravaUpstreamResponse(err);
  }
}
