"use server";

import { revalidatePath } from "next/cache";
import {
  requireLeaderboardAccess,
  requirePortalAdmin,
} from "@/lib/portal/adminAccess";
import { ACTIVE_COMPETITION_ID } from "@/lib/liveCompetition/constants";
import {
  parseCompetitionDetailsFromForm,
  parseCompetitionEntryFromForm,
} from "@/lib/liveCompetition/validation";
import { createAdminClient } from "@/lib/supabase/admin";

export type CompetitionActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateCompetitionPaths() {
  revalidatePath("/portal/admin/competition");
  revalidatePath("/api/live-competition");
}

function requireAdminClient() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Admin access is not configured.");
  }
  return admin;
}

export async function updateCompetitionDetails(
  formData: FormData
): Promise<CompetitionActionResult> {
  await requirePortalAdmin();

  try {
    const admin = requireAdminClient();
    const payload = parseCompetitionDetailsFromForm(formData);

    const { error } = await admin
      .from("active_competition")
      .update(payload)
      .eq("id", ACTIVE_COMPETITION_ID);

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save competition.",
    };
  }

  revalidateCompetitionPaths();
  return { ok: true };
}

export async function createCompetitionEntry(
  formData: FormData
): Promise<CompetitionActionResult> {
  await requireLeaderboardAccess();

  try {
    const admin = requireAdminClient();
    const entry = parseCompetitionEntryFromForm(formData);
    const now = new Date().toISOString();

    const { error } = await admin.from("competition_entry").insert({
      competition_id: ACTIVE_COMPETITION_ID,
      name: entry.name,
      category: entry.category,
      score: entry.score,
      contact: entry.contact,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not add entry.",
    };
  }

  revalidateCompetitionPaths();
  return { ok: true };
}

export async function updateCompetitionEntry(
  id: string,
  formData: FormData
): Promise<CompetitionActionResult> {
  await requireLeaderboardAccess();

  try {
    const admin = requireAdminClient();
    const entry = parseCompetitionEntryFromForm(formData);

    const { error } = await admin
      .from("competition_entry")
      .update({
        name: entry.name,
        category: entry.category,
        score: entry.score,
        contact: entry.contact,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("competition_id", ACTIVE_COMPETITION_ID);

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update entry.",
    };
  }

  revalidateCompetitionPaths();
  return { ok: true };
}

export async function deleteCompetitionEntry(
  id: string
): Promise<CompetitionActionResult> {
  await requireLeaderboardAccess();

  try {
    const admin = requireAdminClient();

    const { error } = await admin
      .from("competition_entry")
      .delete()
      .eq("id", id)
      .eq("competition_id", ACTIVE_COMPETITION_ID);

    if (error) {
      return { ok: false, error: error.message };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not remove entry.",
    };
  }

  revalidateCompetitionPaths();
  return { ok: true };
}
