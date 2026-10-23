export const RECOVERY_FLOWS_COUNT = 21;
export const FREE_RECOVERY_FLOWS_COUNT = 6;
export const WORKOUTS_COUNT = "168+";
export const FREE_WORKOUTS_COUNT = 77;

export type FeatureIcon =
  | "programs"
  | "daily"
  | "workouts"
  | "mobility"
  | "swaps"
  | "explore";

export interface HomeFeature {
  id: string;
  label: string;
  title: string;
  description: string;
  mockup?: string;
  mockupAlt?: string;
  icon: FeatureIcon;
  highlighted?: boolean;
  /** Wide cards span 2 of 3 columns on desktop */
  span?: "wide" | "narrow";
}

/** Desktop bento rows: wide cards span 2 cols, narrow span 1 (3-col grid). Tempered Daily is rendered separately. */
export const homeFeatureRows: string[][] = [
  ["programs", "swaps"],
  ["workouts", "explore"],
  ["recovery"],
];

export const homeFeatures: HomeFeature[] = [
  {
    id: "programs",
    label: "Programs",
    title: "One programme at a time",
    description:
      "Fourteen blocks, seven of them free, from a weekend full-body plan to Olympic lifting and 5/3/1. Sessions land on set days, with warm-ups and logging. Move a session when the week changes. Onboarding picks a starting point from your interests and experience.",
    mockup: "/iphone-mockups/program-view-top-of-screen-portrait.png",
    mockupAlt: "A programme session with the week strip, warm-up, and barbell deadlift",
    icon: "programs",
    span: "wide",
  },
  {
    id: "daily",
    label: "Tempered Daily",
    title: "A new week every Monday",
    description:
      "Coming soon. Seven sessions a week, each with RX and Scaled versions. Do the days you can. Weeks are themed, and the theme changes, from strength to metcon and the work in between, to build a well-rounded athlete. Pro opens the full week. Free accounts will see the shape of the day, then a lock.",
    mockup: "/iphone-mockups/daily-program-screen-portrait.png",
    mockupAlt: "Tempered Daily week view for The Big Three discovery block",
    icon: "daily",
    highlighted: true,
    span: "narrow",
  },
  {
    id: "workouts",
    label: "Workouts",
    title: "One-off sessions",
    description:
      "168+ workouts you can favourite, filter, and log. CrossFit-style WODs, Hyrox, conditioning, strength, Olympic lifting, Rainhill, Arena Games, and Girl Games. Skill sessions are on Pro, and for coaches. Filter by discipline, equipment, duration, and format.",
    mockup: "/iphone-mockups/workouts-page-portrait.png",
    mockupAlt: "Workouts library with disciplines and a CrossFit session",
    icon: "workouts",
    span: "wide",
  },
  {
    id: "swaps",
    label: "Swaps",
    title: "Swap the exercise, keep the session",
    description:
      "Alternatives come from the same movement pattern and muscle group, with a bodyweight-only filter. Free includes 10 swaps a month, resetting on the 1st. Putting an exercise back does not use a swap. Pro is unlimited.",
    mockup: "/iphone-mockups/exerise-swap-portrait.png",
    mockupAlt: "Exercise swap sheet suggesting hip-hinge alternatives for a barbell deadlift",
    icon: "swaps",
    span: "narrow",
  },
  {
    id: "recovery",
    label: "Recovery",
    title: "Flows for the days between",
    description:
      "21 guided flows. Six are free: core stability, desk-job recovery, handstand prep, shoulder health, a full-body flush, and a quick full-body flow. The rest, including hips, wrists, running, and climbing, are Pro. Coaches get every flow. Premium flows stay locked in the rest-day carousel on Free.",
    mockup: "/iphone-mockups/mobility-and-flows-list-portrait.png",
    mockupAlt: "Recovery list with free and Pro mobility flows",
    icon: "mobility",
    span: "wide",
  },
  {
    id: "explore",
    label: "Explore",
    title: "Read, calculate, and shop",
    description:
      "Training articles, a glossary, and a shop of partner products. Together We Lift, the mental-health charity the app supports, lives here too. One-rep max, creatine, and water calculators work offline. Skills and Cues, with videos, drills, and coaching notes, are Pro, and free for coaches.",
    mockup: "/iphone-mockups/explore-page-portrait.png",
    mockupAlt: "Explore tab with Skills and Cues, the shop, and offline tools",
    icon: "explore",
    span: "narrow",
  },
];

export const homeFeatureMap = Object.fromEntries(
  homeFeatures.map((feature) => [feature.id, feature])
) as Record<string, HomeFeature>;

export const sessionBullets = [
  "Log weight and reps, or the score for a timed piece",
  "Rest timer with a lock-screen countdown, including skip and restart",
  "Warm-ups, cool-downs, and notes you can copy from another session",
  "A prompt when a set beats a stored personal best",
  "Training-max percentages that pre-fill the bar on 5/3/1",
];

export const sessionPhones = [
  {
    src: "/iphone-mockups/program-view-deadlift-logged-rest-time-counting-down-portrait.png",
    alt: "Deadlift set logged at 120 kg while the rest timer counts down",
  },
  {
    src: "/iphone-mockups/lock-screen-coundown-ios-widget-portrait.png",
    alt: "iPhone lock screen showing a rest countdown for barbell bench press",
  },
];

export interface AppScreen {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
}

export const moreAppScreens: AppScreen[] = [
  {
    id: "workout",
    title: "Open a workout",
    caption: "Format, warm-up, and a place to log the score.",
    src: "/iphone-mockups/workout-view-portrait.png",
    alt: "Angie workout with a for-time chipper and a log result button",
  },
  {
    id: "flow",
    title: "Follow a flow",
    caption: "Guided blocks with a timer, from the free list or the Pro set.",
    src: "/iphone-mockups/mobility-and-flow-in-progress-portrait.png",
    alt: "Climbing recovery flow in progress with a countdown",
  },
  {
    id: "glossary",
    title: "Look it up",
    caption: "A glossary for the terms in the session, with no account required.",
    src: "/iphone-mockups/glossary-view-portrait.png",
    alt: "Glossary with training terms such as AMRAP expanded",
  },
  {
    id: "pbs",
    title: "Personal bests",
    caption: "Records by exercise and rep range, with a strip of recent bests on Home.",
    src: "/iphone-mockups/pb-view-portrait.png",
    alt: "Personal bests for clean and jerk and related lifts",
  },
  {
    id: "trophies",
    title: "Trophies",
    caption: "Bronze and silver for everyone. Platinum milestones are Pro.",
    src: "/iphone-mockups/trophies-view-portrait.png",
    alt: "Trophies list with achieved milestones",
  },
];

export const freeTierFeatures = [
  "7 complete programmes",
  "77 workouts in the free library",
  "6 recovery and mobility flows",
  "10 exercise swaps a month",
  "Logging, rest timer, and personal bests",
  "Daily training streak",
  "Check-in for 3 behaviours",
  "Women’s health tracking, always included",
  "1 supplement, with dose reminders",
  "Bronze and silver trophies",
  "Articles, glossary, shop, and offline tools",
  "Reorder Home. Works with no account",
  "Live competition and leaderboard, when one is running",
];

export const proTierFeatures = [
  "Everything in Free",
  "Every programme, including 5/3/1 and Olympic peaking",
  "Tempered Daily, coming soon",
  "Full library of 168+ workouts, including skill sessions",
  "Unlimited exercise swaps",
  "All 21 recovery flows",
  "Unlimited check-in behaviours and supplements",
  "Platinum trophies",
  "Skills and Cues",
  "Hide sections on Home",
];
