import { ensureFreshAccessToken, resolveDeviceToken } from "@/lib/strava/auth";
import { deauthorizeAthlete } from "@/lib/strava/client";
import { isStravaConfigured } from "@/lib/strava/config";
import { configurationError, jsonError } from "@/lib/strava/errors";
import { deleteDeviceRecord } from "@/lib/strava/storage";

export async function DELETE(request: Request) {
  if (!isStravaConfigured()) {
    return configurationError();
  }

  const record = await resolveDeviceToken(request);
  if (!record) {
    return jsonError("Missing or invalid device token.", 401);
  }

  try {
    const { accessToken } = await ensureFreshAccessToken(record);
    await deauthorizeAthlete(accessToken).catch(() => undefined);
  } catch {
    // Still remove local tokens if Strava deauthorize fails
  }

  await deleteDeviceRecord(record.deviceToken);

  return new Response(null, { status: 204 });
}
