import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

function getPortalAdminEmails(): string[] {
  const raw = process.env.PORTAL_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isPortalAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = getPortalAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

export function isPortalAdminConfigured(): boolean {
  return getPortalAdminEmails().length > 0 && isSupabaseAdminConfigured();
}

export async function getPortalAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isPortalAdminEmail(user.email)) {
    return null;
  }

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

  if (!isPortalAdminEmail(user.email)) {
    redirect("/portal");
  }

  if (!isSupabaseAdminConfigured()) {
    redirect("/portal");
  }

  return user;
}
