import type { StravaApiTracker } from "./api-metrics";
import {
  disciplineFromStravaActivityType,
  isNearStandardPresetForDiscipline,
} from "./cardioDistances";
import {
  buildStravaSyncPayloadFromActivities,
  isDisciplinesPayloadEmpty,
  ledgersToPayloadDisciplines,
  mergeDisciplineLedgers,
  payloadDisciplinesToLedgers,
  type CardioSyncStats,
} from "./cardioSync";
import {
  DETAIL_FETCH_CONCURRENCY,
  MAX_DETAIL_FETCHES,
  PROCESSED_ACTIVITY_IDS_CAP,
} from "./config";
import {
  getActivityDetail,
  listAthleteActivities,
  type StravaActivitySummary,
} from "./client";
import { computeFallbackFullWindow, computeSyncWindow } from "./sync-window";
import type {
  DeviceSyncState,
  StravaSyncMetrics,
  StravaSyncPayload,
} from "./types";

function needsDetailFetch(activity: StravaActivitySummary): boolean {
  if (activity.best_efforts && activity.best_efforts.length > 0) {
    return false;
  }
  const discipline = disciplineFromStravaActivityType(activity.type);
  if (!discipline) return false;
  if (!activity.distance || activity.distance < 1000) return false;
  return isNearStandardPresetForDiscipline(discipline, activity.distance);
}

function shouldSkipActivity(
  activity: StravaActivitySummary,
  state: DeviceSyncState | null,
  overlapStartMs: number,
  skipProcessedIds: boolean
): boolean {
  if (!skipProcessedIds || !state?.processedActivityIds?.length) return false;

  const activityMs = new Date(activity.start_date).getTime();
  if (activityMs >= overlapStartMs) return false;

  return state.processedActivityIds.includes(String(activity.id));
}

async function fetchDetailsInBatches(
  accessToken: string,
  activityIds: number[],
  tracker: StravaApiTracker
): Promise<StravaActivitySummary[]> {
  const detailed: StravaActivitySummary[] = [];

  for (let i = 0; i < activityIds.length; i += DETAIL_FETCH_CONCURRENCY) {
    if (tracker.detailFetches >= MAX_DETAIL_FETCHES) {
      tracker.setDetailCapHit();
      break;
    }

    const batch = activityIds.slice(i, i + DETAIL_FETCH_CONCURRENCY);
    const remaining = MAX_DETAIL_FETCHES - tracker.detailFetches;
    if (remaining <= 0) {
      tracker.setDetailCapHit();
      break;
    }
    const toFetch = batch.slice(0, remaining);

    if (toFetch.length < batch.length) {
      tracker.setDetailCapHit();
    }

    const results = await Promise.all(
      toFetch.map(async (id) => {
        try {
          return await getActivityDetail(accessToken, id, tracker);
        } catch {
          return null;
        }
      })
    );

    for (const detail of results) {
      if (detail) detailed.push(detail);
    }

    if (tracker.detailFetches >= MAX_DETAIL_FETCHES) {
      tracker.setDetailCapHit();
      break;
    }
  }

  return detailed;
}

function buildNextSyncState(
  deviceToken: string,
  previous: DeviceSyncState | null,
  scannedIds: string[],
  newestActivityEpoch: number,
  disciplines: StravaSyncPayload["disciplines"]
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
    disciplines,
  };
}

type ScanResult = {
  activities: StravaActivitySummary[];
  scannedIds: string[];
  newestActivityEpoch: number;
  stats: CardioSyncStats;
};

async function scanActivities(
  accessToken: string,
  window: ReturnType<typeof computeSyncWindow>,
  syncState: DeviceSyncState | null,
  tracker: StravaApiTracker
): Promise<ScanResult> {
  const listActivities: StravaActivitySummary[] = [];
  const detailFetchIds: number[] = [];
  const scannedIds: string[] = [];
  let newestActivityEpoch = syncState?.lastActivityEpoch ?? 0;

  for (let page = 1; page <= window.maxPages; page++) {
    const activities = await listAthleteActivities(
      accessToken,
      {
        page,
        ...(window.afterEpoch != null ? { after: window.afterEpoch } : {}),
      },
      tracker
    );

    if (activities.length === 0) break;

    for (const activity of activities) {
      if (!disciplineFromStravaActivityType(activity.type)) continue;

      tracker.recordActivityScanned();
      scannedIds.push(String(activity.id));

      const epoch = Math.floor(new Date(activity.start_date).getTime() / 1000);
      if (epoch > newestActivityEpoch) {
        newestActivityEpoch = epoch;
      }

      if (
        shouldSkipActivity(
          activity,
          syncState,
          window.overlapStartMs,
          window.skipProcessedIds
        )
      ) {
        continue;
      }

      listActivities.push(activity);

      if (needsDetailFetch(activity)) {
        detailFetchIds.push(activity.id);
      }
    }

    if (activities.length < 200) break;
  }

  const detailed = await fetchDetailsInBatches(
    accessToken,
    detailFetchIds,
    tracker
  );

  const activitiesById = new Map(
    listActivities.map((activity) => [activity.id, activity])
  );
  for (const detail of detailed) {
    activitiesById.set(detail.id, detail);
  }

  const mergedActivities = [...activitiesById.values()];
  const { stats } = buildStravaSyncPayloadFromActivities(mergedActivities);

  return {
    activities: mergedActivities,
    scannedIds,
    newestActivityEpoch,
    stats,
  };
}

function shouldForceFullHistory(syncState: DeviceSyncState | null): boolean {
  if (!syncState?.lastSyncedAt) return true;
  if (!syncState.disciplines) return true;
  return isDisciplinesPayloadEmpty(syncState.disciplines);
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
  const forceFullHistory = shouldForceFullHistory(syncState);
  let window = computeSyncWindow(syncState, { forceFullHistory });

  let scan = await scanActivities(accessToken, window, syncState, tracker);

  const ledgers = payloadDisciplinesToLedgers(syncState?.disciplines);
  mergeDisciplineLedgers(
    ledgers,
    payloadDisciplinesToLedgers(
      buildStravaSyncPayloadFromActivities(scan.activities).disciplines
    )
  );

  let disciplines = ledgersToPayloadDisciplines(ledgers);

  if (isDisciplinesPayloadEmpty(disciplines) && scan.stats.runActivitiesScanned > 0) {
    window = computeFallbackFullWindow();
    scan = await scanActivities(accessToken, window, syncState, tracker);
    disciplines = buildStravaSyncPayloadFromActivities(scan.activities).disciplines;
  } else if (isDisciplinesPayloadEmpty(disciplines) && !window.fullHistoryScan) {
    window = computeSyncWindow(syncState, { forceFullHistory: true });
    scan = await scanActivities(accessToken, window, syncState, tracker);
    mergeDisciplineLedgers(
      ledgers,
      payloadDisciplinesToLedgers(
        buildStravaSyncPayloadFromActivities(scan.activities).disciplines
      )
    );
    disciplines = ledgersToPayloadDisciplines(ledgers);
  }

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
    fullHistoryScan: window.fullHistoryScan,
    ultrasMatched: scan.stats.ultrasMatched,
    distanceKeysInResponse: countDistanceKeys(disciplines),
    runActivitiesScanned: scan.stats.runActivitiesScanned,
  };

  if (
    process.env.NODE_ENV !== "production" &&
    scan.stats.runActivitiesScanned > 0 &&
    isDisciplinesPayloadEmpty(disciplines)
  ) {
    console.warn("[strava/sync] empty disciplines with run activities scanned", {
      deviceTokenPrefix: deviceToken.slice(0, 8),
      ...metrics,
    });
  }

  return {
    payload: { syncedAt, disciplines },
    metrics,
    nextSyncState: buildNextSyncState(
      deviceToken,
      syncState,
      scan.scannedIds,
      scan.newestActivityEpoch,
      disciplines
    ),
  };
}

function countDistanceKeys(
  disciplines: StravaSyncPayload["disciplines"]
): number {
  let count = 0;
  for (const ledger of Object.values(disciplines)) {
    if (ledger) count += Object.keys(ledger).length;
  }
  return count;
}
