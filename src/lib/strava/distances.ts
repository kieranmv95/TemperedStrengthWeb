import type { Discipline, DistanceKey } from "./types";

export const DISTANCE_PRESETS: { meters: number; key: DistanceKey }[] = [
  { meters: 500, key: "500m" },
  { meters: 1000, key: "1km" },
  { meters: 1609.34, key: "1mi" },
  { meters: 2000, key: "2k" },
  { meters: 5000, key: "5km" },
  { meters: 8046.72, key: "5mi" },
  { meters: 6000, key: "6k" },
  { meters: 10000, key: "10km" },
  { meters: 16093.4, key: "10mi" },
  { meters: 40000, key: "40k" },
  { meters: 21097.5, key: "half" },
  { meters: 42195, key: "full" },
  { meters: 50000, key: "ultra_50k" },
  { meters: 80467.2, key: "ultra_50mi" },
  { meters: 100000, key: "ultra_100k" },
  { meters: 160934, key: "ultra_100mile" },
];

const RUN_KEYS: DistanceKey[] = [
  "1km",
  "1mi",
  "5km",
  "5mi",
  "10km",
  "10mi",
  "half",
  "full",
  "ultra_50k",
  "ultra_50mi",
  "ultra_100k",
  "ultra_100mile",
];

const ROW_KEYS: DistanceKey[] = [
  "500m",
  "1km",
  "2k",
  "5km",
  "6k",
  "10km",
];

const CYCLE_KEYS: DistanceKey[] = [
  "5km",
  "10km",
  "40k",
  "half",
  "full",
  "ultra_50k",
  "ultra_50mi",
  "ultra_100k",
  "ultra_100mile",
];

export function allowedKeysForDiscipline(
  discipline: Discipline
): Set<DistanceKey> {
  switch (discipline) {
    case "run":
      return new Set(RUN_KEYS);
    case "row":
      return new Set(ROW_KEYS);
    case "cycle":
      return new Set(CYCLE_KEYS);
  }
}

export function matchDistanceKey(
  meters: number,
  allowed: Set<DistanceKey>
): DistanceKey | null {
  for (const preset of DISTANCE_PRESETS) {
    if (!allowed.has(preset.key)) continue;
    const tolerance = preset.meters * 0.01;
    if (Math.abs(meters - preset.meters) <= tolerance) {
      return preset.key;
    }
  }
  return null;
}

const STRAVA_TYPE_TO_DISCIPLINE: Record<string, Discipline> = {
  Run: "run",
  VirtualRun: "run",
  TrailRun: "run",
  Rowing: "row",
  Ride: "cycle",
  VirtualRide: "cycle",
  EBikeRide: "cycle",
};

export function disciplineFromStravaType(
  type: string
): Discipline | null {
  return STRAVA_TYPE_TO_DISCIPLINE[type] ?? null;
}
