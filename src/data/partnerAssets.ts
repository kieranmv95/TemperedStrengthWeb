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
