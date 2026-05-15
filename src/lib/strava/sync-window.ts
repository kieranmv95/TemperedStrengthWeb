import {
  ACTIVITY_AFTER_DAYS_FIRST,
  ACTIVITY_OVERLAP_DAYS,
  MAX_LIST_PAGES,
  MAX_LIST_PAGES_INCREMENTAL,
} from "./config";
import type { DeviceSyncState } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SyncWindow = {
  afterEpoch?: number;
  maxPages: number;
  isFirstSync: boolean;
  fullHistoryScan: boolean;
  overlapStartMs: number;
  skipProcessedIds: boolean;
};

export function computeSyncWindow(
  state: DeviceSyncState | null,
  options?: { forceFullHistory?: boolean }
): SyncWindow {
  const now = Date.now();
  const forceFullHistory = options?.forceFullHistory ?? false;

  if (forceFullHistory || !state?.lastSyncedAt) {
    return {
      afterEpoch: undefined,
      maxPages: MAX_LIST_PAGES,
      isFirstSync: !state?.lastSyncedAt,
      fullHistoryScan: true,
      overlapStartMs: 0,
      skipProcessedIds: false,
    };
  }

  const overlapMs = ACTIVITY_OVERLAP_DAYS * MS_PER_DAY;
  const lastSyncedMs = new Date(state.lastSyncedAt).getTime();
  const fromLastSync = lastSyncedMs - overlapMs;
  const fromActivityEpoch = state.lastActivityEpoch
    ? state.lastActivityEpoch * 1000 - overlapMs
    : fromLastSync;
  const afterMs = Math.min(fromLastSync, fromActivityEpoch);

  return {
    afterEpoch: Math.floor(afterMs / 1000),
    maxPages: MAX_LIST_PAGES_INCREMENTAL,
    isFirstSync: false,
    fullHistoryScan: false,
    overlapStartMs: fromLastSync,
    skipProcessedIds: true,
  };
}

export function computeFallbackFullWindow(): SyncWindow {
  const now = Date.now();
  return {
    afterEpoch: Math.floor(
      (now - ACTIVITY_AFTER_DAYS_FIRST * MS_PER_DAY) / 1000
    ),
    maxPages: MAX_LIST_PAGES,
    isFirstSync: false,
    fullHistoryScan: true,
    overlapStartMs: 0,
    skipProcessedIds: false,
  };
}
