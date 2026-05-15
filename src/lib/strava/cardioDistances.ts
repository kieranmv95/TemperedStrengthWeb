import type { Discipline, DistanceKey } from "./types";

export const TOLERANCE_STANDARD = 0.03;
export const TOLERANCE_ULTRA = 0.05;

/** @deprecated Use toleranceForKey */
export const DISTANCE_TOLERANCE = TOLERANCE_STANDARD;

export const ULTRA_DISTANCE_KEYS = new Set<DistanceKey>([
  "ultra_50k",
  "ultra_50mi",
  "ultra_100k",
  "ultra_100mile",
]);

export const FULL_ACTIVITY_KEYS = new Set<DistanceKey>([
  "half",
  "full",
  "40k",
  ...ULTRA_DISTANCE_KEYS,
]);

export type DistancePreset = { key: DistanceKey; meters: number };

export type MatchPresetMode = "best_effort" | "full_activity";

export const DISTANCE_PRESETS: DistancePreset[] = [
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

const RUN_PRESETS: DistancePreset[] = [
  { meters: 1000, key: "1km" },
  { meters: 1609.34, key: "1mi" },
  { meters: 5000, key: "5km" },
  { meters: 8046.72, key: "5mi" },
  { meters: 10000, key: "10km" },
  { meters: 16093.4, key: "10mi" },
  { meters: 21097.5, key: "half" },
  { meters: 42195, key: "full" },
  { meters: 50000, key: "ultra_50k" },
  { meters: 80467.2, key: "ultra_50mi" },
  { meters: 100000, key: "ultra_100k" },
  { meters: 160934, key: "ultra_100mile" },
];

const ROW_PRESETS: DistancePreset[] = [
  { meters: 500, key: "500m" },
  { meters: 1000, key: "1km" },
  { meters: 2000, key: "2k" },
  { meters: 5000, key: "5km" },
  { meters: 6000, key: "6k" },
  { meters: 10000, key: "10km" },
];

const CYCLE_PRESETS: DistancePreset[] = [
  { meters: 5000, key: "5km" },
  { meters: 10000, key: "10km" },
  { meters: 40000, key: "40k" },
  { meters: 21097.5, key: "half" },
  { meters: 42195, key: "full" },
  { meters: 50000, key: "ultra_50k" },
  { meters: 80467.2, key: "ultra_50mi" },
  { meters: 100000, key: "ultra_100k" },
  { meters: 160934, key: "ultra_100mile" },
];

export const CARDIO_DISTANCES_BY_DISCIPLINE: Record<Discipline, DistancePreset[]> =
  {
    run: RUN_PRESETS,
    row: ROW_PRESETS,
    cycle: CYCLE_PRESETS,
  };

export function toleranceForKey(key: DistanceKey): number {
  return ULTRA_DISTANCE_KEYS.has(key) ? TOLERANCE_ULTRA : TOLERANCE_STANDARD;
}

export function distanceMatchesPreset(
  distanceMeters: number,
  presetMeters: number,
  tolerance = TOLERANCE_STANDARD
): boolean {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) return false;
  return (
    Math.abs(distanceMeters - presetMeters) <= presetMeters * tolerance
  );
}

export function matchPreset(
  distanceMeters: number,
  presets: DistancePreset[],
  mode: MatchPresetMode
): DistancePreset | null {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) return null;

  const candidates =
    mode === "full_activity"
      ? presets.filter((p) => FULL_ACTIVITY_KEYS.has(p.key))
      : presets.filter((p) => !ULTRA_DISTANCE_KEYS.has(p.key));

  let best: DistancePreset | null = null;
  let bestDelta = Infinity;

  for (const preset of candidates) {
    const tol = toleranceForKey(preset.key);
    const delta = Math.abs(distanceMeters - preset.meters);
    if (delta <= preset.meters * tol && delta < bestDelta) {
      best = preset;
      bestDelta = delta;
    }
  }

  return best;
}

export function disciplineFromStravaActivityType(
  type: string
): Discipline | null {
  switch (type) {
    case "Run":
    case "TrailRun":
    case "VirtualRun":
      return "run";
    case "Ride":
    case "VirtualRide":
    case "EBikeRide":
    case "EMountainBikeRide":
    case "GravelRide":
    case "MountainBikeRide":
      return "cycle";
    case "Rowing":
      return "row";
    default:
      return null;
  }
}

/** Whether activity distance may have standard best_efforts worth a detail fetch. */
export function isNearStandardPresetForDiscipline(
  discipline: Discipline,
  meters: number
): boolean {
  if (meters < 1000) return false;
  const presets = CARDIO_DISTANCES_BY_DISCIPLINE[discipline];
  return matchPreset(meters, presets, "best_effort") != null;
}
