import {
  SYNC_MAX_ACTIVITY_AGE_MS,
  SYNC_MAX_ACTIVITY_PAGES,
  SYNC_MAX_DETAIL_FETCHES,
} from "./config";
import {
  allowedKeysForDiscipline,
  disciplineFromStravaType,
  matchDistanceKey,
} from "./distances";
import {
  getActivityDetail,
  listAthleteActivities,
  type StravaActivityDetail,
  type StravaActivitySummary,
} from "./client";
import type {
  Discipline,
  DistanceBest,
  DistanceKey,
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

function processActivityDetail(
  discipline: Discipline,
  map: BestMap,
  activity: StravaActivityDetail
): void {
  const activityId = String(activity.id);

  if (activity.best_efforts?.length) {
    for (const effort of activity.best_efforts) {
      processEffort(
        discipline,
        map,
        effort.distance,
        effort.moving_time,
        effort.elapsed_time,
        activity.start_date,
        activityId
      );
    }
  }

  processActivitySummary(discipline, map, activity);
}

export async function buildSyncPayload(
  accessToken: string
): Promise<StravaSyncPayload> {
  const run: BestMap = {};
  const row: BestMap = {};
  const cycle: BestMap = {};

  const maps: Record<Discipline, BestMap> = { run, row, cycle };
  const detailCandidates: StravaActivitySummary[] = [];
  const cutoff = Date.now() - SYNC_MAX_ACTIVITY_AGE_MS;

  for (let page = 1; page <= SYNC_MAX_ACTIVITY_PAGES; page++) {
    const activities = await listAthleteActivities(accessToken, page);
    if (activities.length === 0) break;

    let reachedCutoff = false;

    for (const activity of activities) {
      const started = new Date(activity.start_date).getTime();
      if (started < cutoff) {
        reachedCutoff = true;
        continue;
      }

      const discipline = disciplineFromStravaType(activity.type);
      if (!discipline) continue;

      processActivitySummary(discipline, maps[discipline], activity);
      detailCandidates.push(activity);
    }

    if (reachedCutoff || activities.length < 200) break;
  }

  let detailFetches = 0;
  for (const activity of detailCandidates) {
    if (detailFetches >= SYNC_MAX_DETAIL_FETCHES) break;

    const discipline = disciplineFromStravaType(activity.type);
    if (!discipline) continue;

    detailFetches++;
    try {
      const detail = await getActivityDetail(accessToken, activity.id);
      processActivityDetail(discipline, maps[discipline], detail);
    } catch {
      // Keep summary-based bests if detail fetch fails (rate limit, etc.)
    }
  }

  const disciplines: StravaSyncPayload["disciplines"] = {};
  if (Object.keys(run).length > 0) disciplines.run = run;
  if (Object.keys(row).length > 0) disciplines.row = row;
  if (Object.keys(cycle).length > 0) disciplines.cycle = cycle;

  return {
    syncedAt: new Date().toISOString(),
    disciplines,
  };
}
