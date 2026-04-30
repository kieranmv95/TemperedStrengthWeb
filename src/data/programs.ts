export type ProgramTier = "Free" | "Pro";

export interface Program {
  name: string;
  tier: ProgramTier;
  sessionsPerWeek: string;
  totalRunTime: string;
  typicalSession: string;
  description: string;
}

export const programs: Program[] = [
  {
    name: "Traditional Bodybuilding Split",
    tier: "Free",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "4-week classic bodybuilding block: chest & triceps, back & biceps, legs & shoulders. Rep ranges taper in weeks 3–4 for progressive overload.",
  },
  {
    name: "Pro Bodybuilding Split",
    tier: "Pro",
    sessionsPerWeek: "5 (Mon–Fri)",
    totalRunTime: "16 weeks",
    typicalSession: "~60 min",
    description:
      "16-week advanced bodybuilding plan in four phases (foundation, hypertrophy, intensification, peaking). Five days per week with a dedicated muscle-group focus and structured progressive overload.",
  },
  {
    name: "Pilates Intro (4 Weeks)",
    tier: "Free",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "4 weeks",
    typicalSession: "~25 min",
    description:
      "A beginner-friendly 4-week intro focused on core strength, control, and mobility. Every week builds on the last. You will leave sessions feeling taller, steadier, and more switched on.",
  },
  {
    name: "3 Day Split",
    tier: "Free",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "4-week hypertrophy block (push / pull / legs). Rotates intensity and exercise variations to emphasise muscle-fibre recruitment.",
  },
  {
    name: "5-Day Power & Strength",
    tier: "Pro",
    sessionsPerWeek: "5 (Mon–Fri)",
    totalRunTime: "6 weeks",
    typicalSession: "~60 min",
    description:
      "6-week strength peak. Intensity steps up every two weeks via progressive overload and rep-range tapering.",
  },
  {
    name: "2 Day Full Body",
    tier: "Free",
    sessionsPerWeek: "2 (Sat / Sun)",
    totalRunTime: "12 weeks",
    typicalSession: "~60 min",
    description:
      "12-week full-body maintenance. Movement variants change monthly (foundation → stability → hypertrophy) to limit plateaus.",
  },
  {
    name: "HIIT Shred (6 Weeks)",
    tier: "Pro",
    sessionsPerWeek: "4 (Mon / Wed / Fri / Sun)",
    totalRunTime: "6 weeks",
    typicalSession: "~45 min",
    description:
      "24 unique sessions across 6 weeks. Every day is different. Every session has a named WOD at its centre—a short strength primer earns you the right to get into it.",
  },
  {
    name: "HIIT Shred Taster",
    tier: "Free",
    sessionsPerWeek: "4 (Mon / Wed / Fri / Sun)",
    totalRunTime: "1 week (4 sessions)",
    typicalSession: "~45 min",
    description:
      "A 4-day preview of the full HIIT Shred programme—enough to learn the formats and decide if the six-week block is for you.",
  },
  {
    name: "KB + DB Bootcamp",
    tier: "Pro",
    sessionsPerWeek: "3 (Tue / Thu / Sat)",
    totalRunTime: "6 weeks",
    typicalSession: "~45 min",
    description:
      "Six weeks of kettlebell and dumbbell bootcamp training. Three sessions per week, each with a clear identity—hinge and swing, KB skill and upper body, lower body and Turkish Get-Up—with load stepping up every two weeks.",
  },
  {
    name: "Traditional Powerlifting (SBD)",
    tier: "Free",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "8 weeks",
    typicalSession: "~60 min",
    description:
      "8-week peaking plan for squat, bench, and deadlift. Volume falls as intensity rises toward a week-8 testing session.",
  },
  {
    name: "Olympic Foundations",
    tier: "Free",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "4-week technical build for snatch and clean & jerk. Emphasises bar path, speed, and overhead stability.",
  },
  {
    name: "Advanced Olympic Performance",
    tier: "Pro",
    sessionsPerWeek: "3 (Mon / Wed / Fri)",
    totalRunTime: "8 weeks",
    typicalSession: "~60 min",
    description:
      "8-week peak: phase 1 focuses on volume and positional strength; phase 2 on speed and heavy singles.",
  },
  {
    name: "Pro Powerbuilding",
    tier: "Pro",
    sessionsPerWeek: "4 (Mon / Tue / Thu / Fri)",
    totalRunTime: "12 weeks",
    typicalSession: "~60 min",
    description:
      "12-week powerbuilding plan in three phases (accumulation, intensification, realisation). Four days per week mixing heavy compounds with hypertrophy work for size and strength.",
  },
];
