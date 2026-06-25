"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITY_CONFIGS, isPortalEntityKind } from "@/lib/portal/constants";
import { requirePortalAdmin } from "@/lib/portal/adminAccess";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PortalEntityKind } from "@/lib/portal/types";

function adminEntityPath(kind: PortalEntityKind, id: string) {
  return `/portal/admin/${kind}/${id}`;
}

function revalidateAdminPaths(kind: PortalEntityKind, id: string) {
  revalidatePath("/portal/admin");
  revalidatePath(`/portal/admin/${kind}`);
  revalidatePath(adminEntityPath(kind, id));
}

export async function approveEntity(kind: PortalEntityKind, id: string) {
  await requirePortalAdmin();

  if (!isPortalEntityKind(kind)) {
    redirect("/portal/admin");
  }

  const admin = createAdminClient();
  if (!admin) {
    redirect(`${adminEntityPath(kind, id)}?error=admin_not_configured`);
  }

  const config = ENTITY_CONFIGS[kind];
  const now = new Date().toISOString();

  const { error } = await admin
    .from(config.table)
    .update({
      status: "approved",
      approved_at: now,
      rejection_note: null,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    redirect(`${adminEntityPath(kind, id)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateAdminPaths(kind, id);
  redirect(`/portal/admin/${kind}/${id}?approved=1`);
}

export async function rejectEntity(
  kind: PortalEntityKind,
  id: string,
  formData: FormData
) {
  await requirePortalAdmin();

  if (!isPortalEntityKind(kind)) {
    redirect("/portal/admin");
  }

  const admin = createAdminClient();
  if (!admin) {
    redirect(`${adminEntityPath(kind, id)}?error=admin_not_configured`);
  }

  const note = String(formData.get("rejection_note") ?? "").trim();
  const config = ENTITY_CONFIGS[kind];

  const { error } = await admin
    .from(config.table)
    .update({
      status: "rejected",
      rejection_note: note || null,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    redirect(`${adminEntityPath(kind, id)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateAdminPaths(kind, id);
  redirect(`/portal/admin/${kind}/${id}?rejected=1`);
}
