export {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  disciplineFromStravaActivityType,
  disciplineFromStravaActivityType as disciplineFromStravaType,
  DISTANCE_PRESETS,
  DISTANCE_TOLERANCE,
  distanceMatchesPreset,
  FULL_ACTIVITY_KEYS,
  isNearStandardPresetForDiscipline,
  isNearStandardPresetForDiscipline as isNearAnyPresetForDiscipline,
  matchPreset,
  TOLERANCE_STANDARD,
  TOLERANCE_ULTRA,
  toleranceForKey,
  ULTRA_DISTANCE_KEYS,
} from "./cardioDistances";

import {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  matchPreset,
} from "./cardioDistances";
import type { Discipline, DistanceKey } from "./types";

export function allowedKeysForDiscipline(
  discipline: Discipline
): Set<DistanceKey> {
  return new Set(
    CARDIO_DISTANCES_BY_DISCIPLINE[discipline].map((preset) => preset.key)
  );
}

/** @deprecated Use matchPreset with best_effort or full_activity mode. */
export function matchDistanceKey(
  meters: number,
  allowed: Set<DistanceKey>
): DistanceKey | null {
  for (const discipline of Object.keys(
    CARDIO_DISTANCES_BY_DISCIPLINE
  ) as Discipline[]) {
    for (const mode of ["best_effort", "full_activity"] as const) {
      const matched = matchPreset(
        meters,
        CARDIO_DISTANCES_BY_DISCIPLINE[discipline],
        mode
      );
      if (matched && allowed.has(matched.key)) return matched.key;
    }
  }
  return null;
}
