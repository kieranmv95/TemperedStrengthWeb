export {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  disciplineFromStravaActivityType,
  disciplineFromStravaActivityType as disciplineFromStravaType,
  DISTANCE_PRESETS,
  distanceMatchesPreset,
  DISTANCE_TOLERANCE,
  isNearStandardPresetForDiscipline,
  isNearStandardPresetForDiscipline as isNearAnyPresetForDiscipline,
  matchPreset,
  ULTRA_DISTANCE_KEYS,
} from "./cardioDistances";

import {
  CARDIO_DISTANCES_BY_DISCIPLINE,
  matchPreset,
  ULTRA_DISTANCE_KEYS,
} from "./cardioDistances";
import type { Discipline, DistanceKey } from "./types";

export function allowedKeysForDiscipline(
  discipline: Discipline
): Set<DistanceKey> {
  return new Set(
    CARDIO_DISTANCES_BY_DISCIPLINE[discipline].map((preset) => preset.key)
  );
}

/** @deprecated Use matchPreset from cardioDistances with ultraOnly flag. */
export function matchDistanceKey(
  meters: number,
  allowed: Set<DistanceKey>,
  tolerancePercent = 3
): DistanceKey | null {
  const tolerance = tolerancePercent / 100;
  for (const discipline of Object.keys(
    CARDIO_DISTANCES_BY_DISCIPLINE
  ) as Discipline[]) {
    for (const preset of CARDIO_DISTANCES_BY_DISCIPLINE[discipline]) {
      if (!allowed.has(preset.key)) continue;
      const ultraOnly = ULTRA_DISTANCE_KEYS.has(preset.key);
      const matched = matchPreset(meters, [preset], ultraOnly);
      if (matched) {
        const delta = Math.abs(meters - preset.meters);
        if (delta <= preset.meters * tolerance) return preset.key;
      }
    }
  }
  return null;
}
