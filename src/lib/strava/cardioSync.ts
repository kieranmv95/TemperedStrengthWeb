import {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  disciplineFromStravaActivityType,
  matchPreset,
  ULTRA_DISTANCE_KEYS,
} from "./cardioDistances";
import type { StravaActivitySummary, StravaBestEffort } from "./client";
import type {
  Discipline,
  DistanceBest,
  DistanceKey,
  StravaSyncPayload,
} from "./types";

export type BestEffortInput = {
  distance: number;
  elapsed_time: number;
  start_date?: string;
};

type Ledger = Partial<Record<DistanceKey, DistanceBest>>;

type DisciplineLedgers = Partial<Record<Discipline, Ledger>>;

function considerBest(
  ledger: Ledger,
  key: DistanceKey,
  entry: DistanceBest
): void {
  const current = ledger[key];
  if (!current || entry.durationSeconds < current.durationSeconds) {
    ledger[key] = entry;
  }
}

function mergeLedger(into: Ledger, from: Ledger): void {
  for (const key of Object.keys(from) as DistanceKey[]) {
    const entry = from[key];
    if (entry) considerBest(into, key, entry);
  }
}

export function mergeDisciplineLedgers(
  base: DisciplineLedgers,
  incoming: DisciplineLedgers
): DisciplineLedgers {
  for (const discipline of Object.keys(incoming) as Discipline[]) {
    const source = incoming[discipline];
    if (!source) continue;
    const target = (base[discipline] ??= {});
    mergeLedger(target, source);
  }
  return base;
}

export function ledgersToPayloadDisciplines(
  ledgers: DisciplineLedgers
): StravaSyncPayload["disciplines"] {
  const disciplines: StravaSyncPayload["disciplines"] = {};
  for (const discipline of Object.keys(ledgers) as Discipline[]) {
    const ledger = ledgers[discipline];
    if (ledger && Object.keys(ledger).length > 0) {
      disciplines[discipline] = ledger;
    }
  }
  return disciplines;
}

export function payloadDisciplinesToLedgers(
  disciplines: StravaSyncPayload["disciplines"] | undefined
): DisciplineLedgers {
  if (!disciplines) return {};
  const ledgers: DisciplineLedgers = {};
  for (const discipline of Object.keys(disciplines) as Discipline[]) {
    const ledger = disciplines[discipline];
    if (ledger) ledgers[discipline] = { ...ledger };
  }
  return ledgers;
}

export function isDisciplinesPayloadEmpty(
  disciplines: StravaSyncPayload["disciplines"]
): boolean {
  return !Object.values(disciplines).some(
    (ledger) => ledger && Object.keys(ledger).length > 0
  );
}

export type CardioSyncStats = {
  activitiesScanned: number;
  runActivitiesScanned: number;
  ultrasMatched: number;
  distanceKeysInResponse: number;
};

export function buildStravaSyncPayloadFromActivities(
  activities: StravaActivitySummary[],
  bestEffortsByActivityId: Record<string, BestEffortInput[]> = {}
): { disciplines: StravaSyncPayload["disciplines"]; stats: CardioSyncStats } {
  const ledgers: DisciplineLedgers = {};
  const stats: CardioSyncStats = {
    activitiesScanned: 0,
    runActivitiesScanned: 0,
    ultrasMatched: 0,
    distanceKeysInResponse: 0,
  };

  for (const activity of activities) {
    const discipline = disciplineFromStravaActivityType(activity.type);
    if (!discipline) continue;

    stats.activitiesScanned++;
    if (discipline === "run") stats.runActivitiesScanned++;

    const presets = CARDIO_DISTANCES_BY_DISCIPLINE[discipline];
    const ledger = (ledgers[discipline] ??= {});
    const activityId = String(activity.id);

    const ultra = matchPreset(activity.distance, presets, true);
    if (ultra && activity.moving_time > 0) {
      considerBest(ledger, ultra.key, {
        durationSeconds: activity.moving_time,
        achievedAt: activity.start_date,
        stravaActivityId: activityId,
      });
      stats.ultrasMatched++;
    }

    const efforts =
      bestEffortsByActivityId[activityId] ??
      activity.best_efforts?.map(toBestEffortInput) ??
      [];

    for (const effort of efforts) {
      const preset = matchPreset(effort.distance, presets, false);
      if (!preset || effort.elapsed_time <= 0) continue;

      considerBest(ledger, preset.key, {
        durationSeconds: effort.elapsed_time,
        achievedAt: effort.start_date ?? activity.start_date,
        stravaActivityId: activityId,
      });
    }
  }

  const disciplines = ledgersToPayloadDisciplines(ledgers);
  stats.distanceKeysInResponse = countDistanceKeys(disciplines);

  return { disciplines, stats };
}

function toBestEffortInput(effort: StravaBestEffort): BestEffortInput {
  return {
    distance: effort.distance,
    elapsed_time: effort.elapsed_time,
    start_date: effort.start_date,
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

export function countUltraKeysInDisciplines(
  disciplines: StravaSyncPayload["disciplines"]
): number {
  let count = 0;
  for (const ledger of Object.values(disciplines)) {
    if (!ledger) continue;
    for (const key of Object.keys(ledger) as DistanceKey[]) {
      if (ULTRA_DISTANCE_KEYS.has(key)) count++;
    }
  }
  return count;
}
