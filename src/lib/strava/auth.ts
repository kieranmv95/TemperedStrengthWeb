import { refreshAccessToken } from "./client";
import { getDeviceRecord, updateDeviceTokens } from "./storage";
import type { DeviceStravaRecord } from "./types";

const EXPIRY_BUFFER_SECONDS = 60;

export function parseBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() ?? null;
}

export async function resolveDeviceToken(
  request: Request
): Promise<DeviceStravaRecord | null> {
  const token = parseBearerToken(request);
  if (!token) return null;
  return getDeviceRecord(token);
}

export async function ensureFreshAccessToken(
  record: DeviceStravaRecord
): Promise<{ accessToken: string; record: DeviceStravaRecord }> {
  const now = Math.floor(Date.now() / 1000);
  if (record.accessTokenExpiresAt > now + EXPIRY_BUFFER_SECONDS) {
    return { accessToken: record.accessToken, record };
  }

  const refreshed = await refreshAccessToken(record.refreshToken);
  await updateDeviceTokens(
    record.deviceToken,
    refreshed.access_token,
    refreshed.expires_at,
    refreshed.refresh_token
  );

  const updated = await getDeviceRecord(record.deviceToken);
  if (!updated) {
    throw new Error("Device record missing after token refresh");
  }

  return { accessToken: updated.accessToken, record: updated };
}
