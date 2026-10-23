export interface WorkoutLibraryRow {
  name: string;
  free: number | null;
  pro: number | null;
}

/** Standalone workout counts. Tempered Daily is a separate programme, not part of this library. */
export const workoutLibrary: WorkoutLibraryRow[] = [
  { name: "CrossFit-style WODs", free: 24, pro: 13 },
  { name: "Hyrox", free: 20, pro: 12 },
  { name: "Conditioning", free: 5, pro: 27 },
  { name: "Strength", free: 5, pro: 14 },
  { name: "Olympic lifting", free: 1, pro: 3 },
  { name: "Rainhill", free: 11, pro: null },
  { name: "Arena Games", free: 8, pro: null },
  { name: "Girl Games", free: 3, pro: null },
  { name: "Skill sessions", free: null, pro: 22 },
];

export const workoutFormats = [
  "AMRAP",
  "EMOM",
  "For time",
  "Intervals",
  "Tabata",
  "Chipper",
  "Ladder",
  "Benchmark",
];

export const workoutEquipment = [
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Rower",
  "Bike",
  "Ski erg",
  "Box",
  "Bands",
  "Sled",
];

export const freeRecoveryFlows = [
  "Core Stability",
  "Desk Job Recovery",
  "Handstand Prep",
  "Shoulder Health",
  "Full Body Flush",
  "Quick Full Body Flow",
];

export const proRecoveryDetail =
  "Pro adds hip, thoracic, wrist, knee, and lower-body flows, plus morning, pre-workout, Olympic warm-up, run warm-up and recovery, climbing recovery, and full-body reset. Coaches get every flow.";
