import type { StravaApiTracker } from "./api-metrics";
import {
  DETAIL_FETCH_CONCURRENCY,
  MAX_DETAIL_FETCHES,
  PROCESSED_ACTIVITY_IDS_CAP,
} from "./config";
import {
  allowedKeysForDiscipline,
  disciplineFromStravaType,
  isNearAnyPresetForDiscipline,
  matchDistanceKey,
} from "./distances";
import {
  getActivityDetail,
  listAthleteActivities,
  type StravaActivitySummary,
  type StravaBestEffort,
} from "./client";
import { computeSyncWindow } from "./sync-window";
import type {
  DeviceSyncState,
  Discipline,
  DistanceBest,
  DistanceKey,
  StravaSyncMetrics,
  StravaSyncPayload,
} from "./types";

function durationSeconds(
  movingTime: number | undefined,
  elapsedTime: number | undefined
): number | null {
  if (movingTime != null && movingTime > 0) return movingTime;
  if (elapsedTime != null && elapsedTime > 0) return elapsedTime;
  return null;
}

type BestMap = Partial<Record<DistanceKey, DistanceBest>>;

function considerBest(
  map: BestMap,
  key: DistanceKey,
  duration: number,
  achievedAt: string,
  activityId: string
): void {
  const existing = map[key];
  if (existing && existing.durationSeconds <= duration) return;
  map[key] = {
    durationSeconds: duration,
    achievedAt,
    stravaActivityId: activityId,
  };
}

function processEffort(
  discipline: Discipline,
  map: BestMap,
  meters: number,
  movingTime: number | undefined,
  elapsedTime: number | undefined,
  achievedAt: string,
  activityId: string
): void {
  const allowed = allowedKeysForDiscipline(discipline);
  const key = matchDistanceKey(meters, allowed);
  if (!key) return;

  const duration = durationSeconds(movingTime, elapsedTime);
  if (duration == null) return;

  considerBest(map, key, duration, achievedAt, activityId);
}

function processBestEfforts(
  discipline: Discipline,
  map: BestMap,
  efforts: StravaBestEffort[],
  achievedAt: string,
  activityId: string
): void {
  for (const effort of efforts) {
    processEffort(
      discipline,
      map,
      effort.distance,
      effort.moving_time,
      effort.elapsed_time,
      achievedAt,
      activityId
    );
  }
}

function processActivitySummary(
  discipline: Discipline,
  map: BestMap,
  activity: StravaActivitySummary
): void {
  if (!activity.distance || activity.distance <= 0) return;
  processEffort(
    discipline,
    map,
    activity.distance,
    activity.moving_time,
    activity.elapsed_time,
    activity.start_date,
    String(activity.id)
  );
}

function hasSummaryBestCandidate(
  activity: StravaActivitySummary,
  discipline: Discipline
): boolean {
  if (!activity.distance || activity.distance <= 0) return false;
  const allowed = allowedKeysForDiscipline(discipline);
  if (!matchDistanceKey(activity.distance, allowed)) return false;
  return durationSeconds(activity.moving_time, activity.elapsed_time) != null;
}

function needsDetailFetch(
  activity: StravaActivitySummary,
  discipline: Discipline
): boolean {
  if (activity.best_efforts && activity.best_efforts.length > 0) {
    return false;
  }
  if (hasSummaryBestCandidate(activity, discipline)) {
    return false;
  }
  return isNearAnyPresetForDiscipline(discipline, activity.distance ?? 0, 5);
}

function shouldSkipActivity(
  activity: StravaActivitySummary,
  state: DeviceSyncState | null,
  overlapStartMs: number
): boolean {
  if (!state?.processedActivityIds?.length) return false;

  const activityMs = new Date(activity.start_date).getTime();
  if (activityMs >= overlapStartMs) return false;

  return state.processedActivityIds.includes(String(activity.id));
}

function mergeActivity(
  activity: StravaActivitySummary,
  discipline: Discipline,
  map: BestMap
): void {
  const activityId = String(activity.id);

  if (activity.best_efforts?.length) {
    processBestEfforts(
      discipline,
      map,
      activity.best_efforts,
      activity.start_date,
      activityId
    );
  }

  processActivitySummary(discipline, map, activity);
}

async function fetchDetailsInBatches(
  accessToken: string,
  items: { activity: StravaActivitySummary; discipline: Discipline }[],
  maps: Record<Discipline, BestMap>,
  tracker: StravaApiTracker
): Promise<void> {
  for (let i = 0; i < items.length; i += DETAIL_FETCH_CONCURRENCY) {
    if (tracker.detailFetches >= MAX_DETAIL_FETCHES) {
      tracker.setDetailCapHit();
      break;
    }

    const batch = items.slice(i, i + DETAIL_FETCH_CONCURRENCY);
    const remaining = MAX_DETAIL_FETCHES - tracker.detailFetches;
    if (remaining <= 0) {
      tracker.setDetailCapHit();
      break;
    }
    const toFetch = batch.slice(0, remaining);

    if (toFetch.length < batch.length) {
      tracker.setDetailCapHit();
    }

    await Promise.all(
      toFetch.map(async ({ activity, discipline }) => {
        try {
          const detail = await getActivityDetail(
            accessToken,
            activity.id,
            tracker
          );
          mergeActivity(detail, discipline, maps[discipline]);
        } catch {
          mergeActivity(activity, discipline, maps[discipline]);
        }
      })
    );

    if (tracker.detailFetches >= MAX_DETAIL_FETCHES) {
      tracker.setDetailCapHit();
      break;
    }
  }
}

function buildNextSyncState(
  deviceToken: string,
  previous: DeviceSyncState | null,
  scannedIds: string[],
  newestActivityEpoch: number
): DeviceSyncState {
  const now = new Date().toISOString();
  const mergedIds = [
    ...scannedIds,
    ...(previous?.processedActivityIds ?? []),
  ];
  const uniqueIds = [...new Set(mergedIds)].slice(0, PROCESSED_ACTIVITY_IDS_CAP);

  return {
    deviceToken,
    lastSyncedAt: now,
    lastActivityEpoch: Math.max(
      newestActivityEpoch,
      previous?.lastActivityEpoch ?? 0
    ),
    processedActivityIds: uniqueIds,
  };
}

export type SyncResult = {
  payload: StravaSyncPayload;
  metrics: StravaSyncMetrics;
  nextSyncState: DeviceSyncState;
};

export async function buildSyncPayload(
  accessToken: string,
  deviceToken: string,
  syncState: DeviceSyncState | null,
  tracker: StravaApiTracker
): Promise<SyncResult> {
  const startedAt = Date.now();
  const window = computeSyncWindow(syncState);

  const run: BestMap = {};
  const row: BestMap = {};
  const cycle: BestMap = {};
  const maps: Record<Discipline, BestMap> = { run, row, cycle };

  const detailQueue: {
    activity: StravaActivitySummary;
    discipline: Discipline;
  }[] = [];
  const scannedIds: string[] = [];
  let newestActivityEpoch = syncState?.lastActivityEpoch ?? 0;

  for (let page = 1; page <= window.maxPages; page++) {
    const activities = await listAthleteActivities(
      accessToken,
      { page, after: window.afterEpoch },
      tracker
    );

    if (activities.length === 0) break;

    for (const activity of activities) {
      const discipline = disciplineFromStravaType(activity.type);
      if (!discipline) continue;

      tracker.recordActivityScanned();
      scannedIds.push(String(activity.id));

      const epoch = Math.floor(new Date(activity.start_date).getTime() / 1000);
      if (epoch > newestActivityEpoch) {
        newestActivityEpoch = epoch;
      }

      if (shouldSkipActivity(activity, syncState, window.overlapStartMs)) {
        continue;
      }

      mergeActivity(activity, discipline, maps[discipline]);

      if (needsDetailFetch(activity, discipline)) {
        detailQueue.push({ activity, discipline });
      }
    }

    if (activities.length < 200) break;
  }

  await fetchDetailsInBatches(accessToken, detailQueue, maps, tracker);

  const disciplines: StravaSyncPayload["disciplines"] = {};
  if (Object.keys(run).length > 0) disciplines.run = run;
  if (Object.keys(row).length > 0) disciplines.row = row;
  if (Object.keys(cycle).length > 0) disciplines.cycle = cycle;

  const syncedAt = new Date().toISOString();
  const metrics: StravaSyncMetrics = {
    apiCalls: tracker.apiCalls,
    listPages: tracker.listPages,
    detailFetches: tracker.detailFetches,
    activitiesScanned: tracker.activitiesScanned,
    detailCapHit: tracker.detailCapHit,
    durationMs: Date.now() - startedAt,
    rateLimitUsage: tracker.rateLimitUsage,
    isFirstSync: window.isFirstSync,
  };

  return {
    payload: { syncedAt, disciplines },
    metrics,
    nextSyncState: buildNextSyncState(
      deviceToken,
      syncState,
      scannedIds,
      newestActivityEpoch
    ),
  };
}
