import { headers } from "next/headers";
import { userAgent } from "next/server";

export type Platform = "ios" | "android" | "desktop";

export function platformFromAgent(osName: string | undefined, rawUa: string): Platform {
  const os = (osName ?? "").toLowerCase();
  if (os === "ios" || /iPad|iPhone|iPod/i.test(rawUa)) return "ios";
  if (os === "android" || /Android/i.test(rawUa)) return "android";
  return "desktop";
}

/** Reads the request's user agent. Makes the calling route dynamic. */
export async function getRequestPlatform(): Promise<Platform> {
  const agent = userAgent({ headers: await headers() });
  return platformFromAgent(agent.os.name, agent.ua);
}
