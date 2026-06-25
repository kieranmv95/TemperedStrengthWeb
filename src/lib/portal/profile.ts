import { createClient } from "@/lib/supabase/server";
import type { PortalProfile } from "@/lib/portal/types";

export async function getPortalProfile(
  userId: string
): Promise<PortalProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portal_profiles")
    .select("id, display_name, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load portal profile:", error.message);
    return null;
  }

  return data as PortalProfile | null;
}

export async function ensurePortalProfile(userId: string): Promise<PortalProfile> {
  const existing = await getPortalProfile(userId);
  if (existing) return existing;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portal_profiles")
    .insert({ id: userId })
    .select("id, display_name, created_at")
    .single();

  if (error) {
    // Row may have been created concurrently (e.g. trigger on signup)
    const retry = await getPortalProfile(userId);
    if (retry) return retry;
    throw new Error(error.message);
  }

  return data as PortalProfile;
}

export function needsDisplayName(profile: PortalProfile | null): boolean {
  return !profile?.display_name?.trim();
}

export function validateDisplayName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Please enter a name.");
  }
  if (trimmed.length > 100) {
    throw new Error("Name must be 100 characters or fewer.");
  }
  return trimmed;
}
