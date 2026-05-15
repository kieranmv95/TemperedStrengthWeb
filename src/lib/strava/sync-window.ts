import {
  ACTIVITY_AFTER_DAYS_FIRST,
  ACTIVITY_OVERLAP_DAYS,
  MAX_LIST_PAGES,
  MAX_LIST_PAGES_INCREMENTAL,
} from "./config";
import type { DeviceSyncState } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SyncWindow = {
  afterEpoch: number;
  maxPages: number;
  isFirstSync: boolean;
  overlapStartMs: number;
};

export function computeSyncWindow(
  state: DeviceSyncState | null
): SyncWindow {
  const now = Date.now();

  if (!state?.lastSyncedAt) {
    return {
      afterEpoch: Math.floor(
        (now - ACTIVITY_AFTER_DAYS_FIRST * MS_PER_DAY) / 1000
      ),
      maxPages: MAX_LIST_PAGES,
      isFirstSync: true,
      overlapStartMs: now - ACTIVITY_OVERLAP_DAYS * MS_PER_DAY,
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
    overlapStartMs: fromLastSync,
  };
}
