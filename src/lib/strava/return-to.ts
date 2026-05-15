import { getAllowedReturnToUrls } from "./config";

export function isAllowedReturnTo(returnTo: string): boolean {
  const allowed = getAllowedReturnToUrls();
  if (allowed.includes(returnTo)) return true;

  try {
    const parsed = new URL(returnTo);
    if (parsed.protocol !== "temperedstrengthapp:") return false;
    const path = parsed.pathname.replace(/^\//, "") || parsed.hostname;
    return path === "strava" || parsed.hostname === "strava";
  } catch {
    return false;
  }
}

export function buildReturnUrl(
  returnTo: string,
  params: Record<string, string>
): string {
  const separator = returnTo.includes("?") ? "&" : "?";
  const query = new URLSearchParams(params).toString();
  return `${returnTo}${separator}${query}`;
}
