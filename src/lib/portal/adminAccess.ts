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

export async function requirePortalAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login?next=/portal/admin");
  }

  const profile = await getPortalProfile(user.id);
  if (!isPortalAdmin(profile)) {
    redirect("/portal");
  }

  if (!isSupabaseAdminConfigured()) {
    redirect("/portal");
  }

  return user;
}
