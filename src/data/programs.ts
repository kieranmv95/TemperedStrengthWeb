export type ProgramTier = "Free" | "Pro";
export type ProgramLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Program {
  name: string;
  tier: ProgramTier;
  level: ProgramLevel;
  sessionsPerWeek: string;
  totalRunTime: string;
  typicalSession: string;
  description: string;
}

export const programs: Program[] = [
  {
    name: "Traditional Bodybuilding Split",
    tier: "Free",
    level: "Beginner",
    sessionsPerWeek: "3 days",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "Chest and triceps, back and biceps, legs and shoulders. A classic split for getting into the gym on a simple week.",
  },
  {
    name: "3 Day Split",
    tier: "Free",
    level: "Beginner",
    sessionsPerWeek: "3 days",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "A hypertrophy block built around push, pull, and legs.",
  },
  {
    name: "2 Day Full Body",
    tier: "Free",
    level: "Beginner",
    sessionsPerWeek: "2 days, weekends",
    totalRunTime: "12 weeks",
    typicalSession: "~60 min",
    description:
      "Weekend sessions for maintenance and steady strength when the week itself is already full.",
  },
  {
    name: "Traditional Powerlifting (SBD)",
    tier: "Free",
    level: "Intermediate",
    sessionsPerWeek: "3 days",
    totalRunTime: "8 weeks",
    typicalSession: "~60 min",
    description:
      "A squat, bench, and deadlift peak that finishes with a test week.",
  },
  {
    name: "Olympic Foundations",
    tier: "Free",
    level: "Intermediate",
    sessionsPerWeek: "3 days",
    totalRunTime: "4 weeks",
    typicalSession: "~60 min",
    description:
      "Technique-first snatch and clean and jerk. The point is positions and timing, then load.",
  },
  {
    name: "HIIT Shred Taster",
    tier: "Free",
    level: "Beginner",
    sessionsPerWeek: "4 sessions",
    totalRunTime: "Preview",
    typicalSession: "~45 min",
    description:
      "A four-session preview of the full HIIT programme, enough to learn the formats before the six-week block.",
  },
  {
    name: "Pilates Intro",
    tier: "Free",
    level: "Beginner",
    sessionsPerWeek: "3 days",
    totalRunTime: "4 weeks",
    typicalSession: "~25 min",
    description:
      "Core, control, and mobility. Shorter sessions you can keep next to heavier training.",
  },
  {
    name: "Pro Bodybuilding Split",
    tier: "Pro",
    level: "Advanced",
    sessionsPerWeek: "5 days",
    totalRunTime: "16 weeks",
    typicalSession: "~60 min",
    description:
      "Four phases, from foundation through peaking, with a dedicated focus each day.",
  },
  {
    name: "5-Day Power & Strength",
    tier: "Pro",
    level: "Advanced",
    sessionsPerWeek: "5 days",
    totalRunTime: "6 weeks",
    typicalSession: "~60 min",
    description:
      "A strength peak in three steps: volume, strength, then peak.",
  },
  {
    name: "Wendler 5/3/1 (3-Day)",
    tier: "Pro",
    level: "Advanced",
    sessionsPerWeek: "3 days",
    totalRunTime: "16 weeks",
    typicalSession: "~60 min",
    description:
      "Four cycles of squat, strict press, and deadlift from a training max, with AMRAP top sets. Percentages pre-fill the weight.",
  },
  {
    name: "Pro Powerbuilding",
    tier: "Pro",
    level: "Advanced",
    sessionsPerWeek: "4 days",
    totalRunTime: "12 weeks",
    typicalSession: "~60–75 min",
    description:
      "Heavy compounds plus hypertrophy work, so strength and size move together.",
  },
  {
    name: "Advanced Olympic Performance",
    tier: "Pro",
    level: "Advanced",
    sessionsPerWeek: "3 days",
    totalRunTime: "8 weeks",
    typicalSession: "~60 min",
    description:
      "A snatch and clean and jerk peak that ends in a three-attempt competition simulation.",
  },
  {
    name: "HIIT Shred Full",
    tier: "Pro",
    level: "Beginner",
    sessionsPerWeek: "4 days",
    totalRunTime: "6 weeks",
    typicalSession: "~45 min",
    description:
      "24 unique sessions. Each one opens with a strength primer, then a named workout.",
  },
  {
    name: "KB + DB Bootcamp",
    tier: "Pro",
    level: "Beginner",
    sessionsPerWeek: "3 days",
    totalRunTime: "6 weeks",
    typicalSession: "~45 min",
    description:
      "Kettlebell and dumbbell circuits, skill work, and finishers. No barbell required.",
  },
];

export const temperedDaily = {
  name: "Tempered Daily",
  tier: "Pro" as const,
  comingSoon: true,
  sessionsPerWeek: "7 sessions",
  totalRunTime: "New week every Monday",
  typicalSession: "RX and Scaled",
  description:
    "Coming soon. A new week will drop every Monday at 00:01. Seven sessions, each with an RX and a Scaled version. Do the days you can. Pro will open the full week. Free accounts will see the shape of the session, then a lock. On a rest day that is also today, Pro will be able to open that day’s session from the rest-day screen.",
  blocks:
    "Each week has a theme, and the theme changes. Strength, metcon, and the work in between, so the training builds a well-rounded athlete rather than one style.",
};
