export const RECOVERY_FLOWS_COUNT = 20;
export const WORKOUTS_COUNT = "150+";

export type FeatureIcon =
  | "programs"
  | "workouts"
  | "mobility"
  | "swaps"
  | "hub"
  | "perks";

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

/** Desktop bento rows: wide cards span 2 cols, narrow span 1 (3-col grid) */
export const homeFeatureRows: string[][] = [
  ["programs", "mobility"],
  ["workouts", "swaps"],
  ["hub", "perks"],
];

export const homeFeatures: HomeFeature[] = [
  {
    id: "programs",
    label: "Programs",
    title: "Structured Programs",
    description:
      "13 complete programmes from bodybuilding to Olympic lifting, with 7 free, forever.",
    mockup: "/mockups/programs.png",
    mockupAlt: "Tempered Strength programs screen",
    icon: "programs",
    span: "wide",
  },
  {
    id: "mobility",
    label: "Recovery",
    title: "Recovery & Mobility Flows",
    description:
      "20 guided flows for rest days, warm-ups, and staying mobile between heavy sessions.",
    mockup: "/mockups/mobility-flow-in-progress.png",
    mockupAlt: "Recovery and mobility flow in progress",
    icon: "mobility",
    highlighted: true,
    span: "narrow",
  },
  {
    id: "workouts",
    label: "Workouts",
    title: "On-Demand Workouts",
    description:
      "150+ standalone sessions including CrossFit, Hyrox, Pilates, and more. No programme required.",
    mockup: "/mockups/workouts.png",
    mockupAlt: "Tempered Strength on-demand workouts screen",
    icon: "workouts",
    span: "wide",
  },
  {
    id: "swaps",
    label: "Smart",
    title: "Smart Exercise Swaps",
    description:
      "Swap any exercise to match your equipment without breaking the programme structure.",
    mockup: "/mockups/program-in-progress.png",
    mockupAlt: "Smart exercise swap in a program session",
    icon: "swaps",
    span: "narrow",
  },
  {
    id: "hub",
    label: "Learn",
    title: "The Hub",
    description:
      "Articles, glossary, and learning resources to help you train smarter, not just harder.",
    mockup: "/mockups/hub.png",
    mockupAlt: "Tempered Strength Hub articles and learning resources",
    icon: "hub",
    span: "narrow",
  },
  {
    id: "perks",
    label: "Perks",
    title: "Member Perks",
    description:
      "Exclusive fitness discounts and partner offers, built into the app.",
    mockup: "/mockups/exlusive-deals-shop.png",
    mockupAlt: "Member discounts and partner offers shop",
    icon: "perks",
    span: "wide",
  },
];

export const homeFeatureMap = Object.fromEntries(
  homeFeatures.map((feature) => [feature.id, feature])
) as Record<string, HomeFeature>;

export const smartTrainingBullets = [
  "Equipment-adaptive exercise swaps",
  "In-session timers and logging built in",
  "Move programme days when life gets in the way",
];

export const freeTierFeatures = [
  "Multiple complete training programmes",
  "On-demand workouts (limited)",
  "Recovery & mobility flows",
  "The Hub: articles & glossary",
  "Discounts & offers shop",
  "Tools access",
  "All video tutorials",
  "10 Smart exercise swaps per month",
];

export const proTierFeatures = [
  "Everything in Free",
  "All PRO programmes available",
  "Full on-demand workouts library",
  "Unlimited Smart exercise swaps",
  "Exclusive content & features",
  "Early access to new features",
  "Access to all Mobility flows",
];
