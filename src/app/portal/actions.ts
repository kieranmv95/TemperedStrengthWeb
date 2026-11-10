"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ensurePortalProfile,
  validateDisplayName,
} from "@/lib/portal/profile";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/portal/login");
  }

  return { supabase, user };
}

/** Result shape for portal forms — errors stay on the page, no redirect. */
export type PortalFormResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function savePortalDisplayName(
  formData: FormData
): Promise<PortalFormResult> {
  const { supabase, user } = await requireUser();

  try {
    const display_name = validateDisplayName(
      String(formData.get("display_name") ?? "")
    );

    await ensurePortalProfile(user.id);

    const { error } = await supabase
      .from("portal_profiles")
      .update({ display_name })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save your name.",
    };
  }

  revalidatePath("/portal");
  return { ok: true, redirectTo: "/portal" };
}
