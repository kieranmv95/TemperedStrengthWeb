import { kv } from "@vercel/kv";
import {
  PENDING_OAUTH_TTL_SECONDS,
  SYNC_RATE_LIMIT_SECONDS,
} from "./config";
import { decryptSecret, encryptSecret } from "./crypto";
import type {
  DeviceStravaRecord,
  DeviceSyncState,
  PendingOAuthSession,
  StravaOAuthTokens,
} from "./types";

const PREFIX_PENDING = "strava:pending:";
const PREFIX_OAUTH = "strava:oauth:";
const PREFIX_DEVICE = "strava:device:";
const PREFIX_SYNC_LIMIT = "strava:sync-limit:";
const PREFIX_SYNC_STATE = "strava:sync-state:";

type StoredDevice = Omit<DeviceStravaRecord, "refreshToken" | "accessToken"> & {
  refreshTokenEnc: string;
  accessTokenEnc: string;
};

type StoredOAuth = Omit<StravaOAuthTokens, "refreshToken" | "accessToken"> & {
  refreshTokenEnc: string;
  accessTokenEnc: string;
};

/** Vercel KV was migrated to Upstash; accept either env naming scheme. */
function ensureKvEnvAliases(): void {
  if (!process.env.KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_URL) {
    process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
  }
  if (!process.env.KV_REST_API_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN) {
    process.env.KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  }
}

function kvAvailable(): boolean {
  ensureKvEnvAliases();
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

const devMemory = new Map<string, { value: string; expiresAt?: number }>();

async function kvSet(
  key: string,
  value: unknown,
  options?: { ex?: number }
): Promise<void> {
  if (kvAvailable()) {
    if (options?.ex) {
      await kv.set(key, value, { ex: options.ex });
    } else {
      await kv.set(key, value);
    }
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("KV storage is not configured");
  }

  devMemory.set(key, {
    value: JSON.stringify(value),
    expiresAt: options?.ex ? Date.now() + options.ex * 1000 : undefined,
  });
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (kvAvailable()) {
    return (await kv.get<T>(key)) ?? null;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("KV storage is not configured");
  }

  const entry = devMemory.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    devMemory.delete(key);
    return null;
  }
  return JSON.parse(entry.value) as T;
}

async function kvDel(key: string): Promise<void> {
  if (kvAvailable()) {
    await kv.del(key);
    return;
  }
  devMemory.delete(key);
}

function toStoredOAuth(tokens: StravaOAuthTokens): StoredOAuth {
  return {
    linkId: tokens.linkId,
    stravaAthleteId: tokens.stravaAthleteId,
    refreshTokenEnc: encryptSecret(tokens.refreshToken),
    accessTokenEnc: encryptSecret(tokens.accessToken),
    accessTokenExpiresAt: tokens.accessTokenExpiresAt,
    createdAt: tokens.createdAt,
  };
}

function fromStoredOAuth(stored: StoredOAuth): StravaOAuthTokens {
  return {
    linkId: stored.linkId,
    stravaAthleteId: stored.stravaAthleteId,
    refreshToken: decryptSecret(stored.refreshTokenEnc),
    accessToken: decryptSecret(stored.accessTokenEnc),
    accessTokenExpiresAt: stored.accessTokenExpiresAt,
    createdAt: stored.createdAt,
  };
}

function toStoredDevice(record: DeviceStravaRecord): StoredDevice {
  return {
    deviceToken: record.deviceToken,
    stravaAthleteId: record.stravaAthleteId,
    refreshTokenEnc: encryptSecret(record.refreshToken),
    accessTokenEnc: encryptSecret(record.accessToken),
    accessTokenExpiresAt: record.accessTokenExpiresAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function fromStoredDevice(stored: StoredDevice): DeviceStravaRecord {
  return {
    deviceToken: stored.deviceToken,
    stravaAthleteId: stored.stravaAthleteId,
    refreshToken: decryptSecret(stored.refreshTokenEnc),
    accessToken: decryptSecret(stored.accessTokenEnc),
    accessTokenExpiresAt: stored.accessTokenExpiresAt,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
  };
}

export async function savePendingOAuth(
  session: PendingOAuthSession
): Promise<void> {
  await kvSet(`${PREFIX_PENDING}${session.linkId}`, session, {
    ex: PENDING_OAUTH_TTL_SECONDS,
  });
}

export async function getPendingOAuth(
  linkId: string
): Promise<PendingOAuthSession | null> {
  return kvGet<PendingOAuthSession>(`${PREFIX_PENDING}${linkId}`);
}

export async function deletePendingOAuth(linkId: string): Promise<void> {
  await kvDel(`${PREFIX_PENDING}${linkId}`);
}

export async function saveOAuthTokens(tokens: StravaOAuthTokens): Promise<void> {
  await kvSet(`${PREFIX_OAUTH}${tokens.linkId}`, toStoredOAuth(tokens), {
    ex: PENDING_OAUTH_TTL_SECONDS,
  });
}

export async function getOAuthTokens(
  linkId: string
): Promise<StravaOAuthTokens | null> {
  const stored = await kvGet<StoredOAuth>(`${PREFIX_OAUTH}${linkId}`);
  if (!stored) return null;
  return fromStoredOAuth(stored);
}

export async function deleteOAuthTokens(linkId: string): Promise<void> {
  await kvDel(`${PREFIX_OAUTH}${linkId}`);
}

export async function saveDeviceRecord(
  record: DeviceStravaRecord
): Promise<void> {
  await kvSet(`${PREFIX_DEVICE}${record.deviceToken}`, toStoredDevice(record));
}

export async function getDeviceRecord(
  deviceToken: string
): Promise<DeviceStravaRecord | null> {
  const stored = await kvGet<StoredDevice>(`${PREFIX_DEVICE}${deviceToken}`);
  if (!stored) return null;
  return fromStoredDevice(stored);
}

export async function deleteDeviceRecord(deviceToken: string): Promise<void> {
  await kvDel(`${PREFIX_DEVICE}${deviceToken}`);
  await kvDel(`${PREFIX_SYNC_LIMIT}${deviceToken}`);
  await kvDel(`${PREFIX_SYNC_STATE}${deviceToken}`);
}

export async function getDeviceSyncState(
  deviceToken: string
): Promise<DeviceSyncState | null> {
  return kvGet<DeviceSyncState>(`${PREFIX_SYNC_STATE}${deviceToken}`);
}

export async function saveDeviceSyncState(
  state: DeviceSyncState
): Promise<void> {
  await kvSet(`${PREFIX_SYNC_STATE}${state.deviceToken}`, state);
}

export async function getLastSyncAt(deviceToken: string): Promise<number | null> {
  return kvGet<number>(`${PREFIX_SYNC_LIMIT}${deviceToken}`);
}

export async function setLastSyncAt(deviceToken: string): Promise<void> {
  await kvSet(`${PREFIX_SYNC_LIMIT}${deviceToken}`, Date.now(), {
    ex: SYNC_RATE_LIMIT_SECONDS * 2,
  });
}

export async function isSyncRateLimited(deviceToken: string): Promise<boolean> {
  const last = await getLastSyncAt(deviceToken);
  if (last == null) return false;
  return Date.now() - last < SYNC_RATE_LIMIT_SECONDS * 1000;
}

export async function updateDeviceTokens(
  deviceToken: string,
  accessToken: string,
  accessTokenExpiresAt: number,
  refreshToken?: string
): Promise<void> {
  const record = await getDeviceRecord(deviceToken);
  if (!record) return;

  const updated: DeviceStravaRecord = {
    ...record,
    accessToken,
    accessTokenExpiresAt,
    refreshToken: refreshToken ?? record.refreshToken,
    updatedAt: new Date().toISOString(),
  };
  await saveDeviceRecord(updated);
}
