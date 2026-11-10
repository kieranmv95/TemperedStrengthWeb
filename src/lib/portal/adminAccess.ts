import { redirect } from "next/navigation";
import { getPortalProfile } from "@/lib/portal/profile";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PortalProfile } from "@/lib/portal/types";

export function isPortalAdmin(
  profile: Pick<PortalProfile, "user_type"> | null | undefined
): boolean {
  return profile?.user_type === "ADMIN";
}

export function canAccessPortalAdmin(
  profile: Pick<PortalProfile, "user_type"> | null | undefined
): boolean {
  return (
    profile?.user_type === "ADMIN" ||
    profile?.user_type === "LEADERBOARD_ACCESS"
  );
}

export function isPortalAdminConfigured(): boolean {
  return isSupabaseAdminConfigured();
}

export async function getPortalAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getPortalProfile(user.id);
  if (!isPortalAdmin(profile)) return null;

  return user;
}

async function requireSignedInAdminArea() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const profile = await getPortalProfile(user.id);
  if (!canAccessPortalAdmin(profile) || !profile) {
    redirect("/portal/no-access");
  }

  if (!isSupabaseAdminConfigured()) {
    redirect("/portal/no-access");
  }

  return { user, profile };
}

/** ADMIN or LEADERBOARD_ACCESS — the signed-in /portal area. */
export async function requirePortalAdminAreaAccess() {
  return requireSignedInAdminArea();
}

/** Full portal admin (promo codes, competition details). */
export async function requirePortalAdmin() {
  const { user, profile } = await requireSignedInAdminArea();

  if (!isPortalAdmin(profile)) {
    redirect("/portal");
  }

  return user;
}

/** ADMIN or LEADERBOARD_ACCESS — add / update / delete competition entries. */
export async function requireLeaderboardAccess() {
  return requireSignedInAdminArea();
}
