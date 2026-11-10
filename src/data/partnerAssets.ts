export interface PartnerAsset {
  fileUrl: string;
  title: string;
  description: string;
  bg: string;
}

/** Paths are relative to /public — e.g. `/partners/logo.png`, not `/public/partners/...`. */
export const partnerAssets: PartnerAsset[] = [
  {
    fileUrl: "/partners/ts_logo_black.svg",
    title: "Black Logo SVG",
    description: "Black text logo in SVG format. Best for light backgrounds and print.",
    bg: "#ffffff",
  },
  {
    fileUrl: "/partners/ts_logo_black.png",
    title: "Black Logo PNG",
    description: "Black text logo as a high-resolution PNG for mockups and social graphics.",
    bg: "#ffffff",
  },
  {
    fileUrl: "/partners/ts_logo_white.svg",
    title: "White Logo SVG",
    description: "White text logo in SVG format. Best for dark backgrounds and overlays.",
    bg: "#0a0a0a",
  },
  {
    fileUrl: "/partners/ts_logo_white.png",
    title: "White Logo PNG",
    description: "White text logo as a high-resolution PNG for mockups on dark backgrounds.",
    bg: "#0a0a0a",
  },
];

export interface DeviceFrameAsset {
  fileUrl: string;
  title: string;
}

/** Framed iPhone screens in /public/iphone-mockups. */
export const deviceFrameAssets: DeviceFrameAsset[] = [
  { fileUrl: "/iphone-mockups/home-screen-portrait.png", title: "Home" },
  {
    fileUrl: "/iphone-mockups/daily-program-screen-portrait.png",
    title: "Tempered Daily",
  },
  {
    fileUrl: "/iphone-mockups/program-view-top-of-screen-portrait.png",
    title: "Programme",
  },
  {
    fileUrl:
      "/iphone-mockups/program-view-deadlift-logged-rest-time-counting-down-portrait.png",
    title: "Rest timer",
  },
  {
    fileUrl: "/iphone-mockups/lock-screen-coundown-ios-widget-portrait.png",
    title: "Lock screen widget",
  },
  { fileUrl: "/iphone-mockups/workouts-page-portrait.png", title: "Workouts" },
  { fileUrl: "/iphone-mockups/workout-view-portrait.png", title: "Workout" },
  { fileUrl: "/iphone-mockups/exerise-swap-portrait.png", title: "Exercise swap" },
  {
    fileUrl: "/iphone-mockups/mobility-and-flows-list-portrait.png",
    title: "Mobility and flows",
  },
  {
    fileUrl: "/iphone-mockups/mobility-and-flow-in-progress-portrait.png",
    title: "Flow in progress",
  },
  { fileUrl: "/iphone-mockups/explore-page-portrait.png", title: "Explore" },
  { fileUrl: "/iphone-mockups/glossary-view-portrait.png", title: "Glossary" },
  { fileUrl: "/iphone-mockups/pb-view-portrait.png", title: "Personal bests" },
  { fileUrl: "/iphone-mockups/trophies-view-portrait.png", title: "Trophies" },
];

export interface BrandColor {
  name: string;
  hex: string;
}

/** Core brand colours from the site theme. */
export const brandColors: BrandColor[] = [
  { name: "Gold", hex: "#FFBA6F" },
  { name: "Light gold", hex: "#FFCA91" },
  { name: "Ink", hex: "#1A1108" },
  { name: "Black", hex: "#0A0A0A" },
  { name: "Off-white", hex: "#F5F5F5" },
];
