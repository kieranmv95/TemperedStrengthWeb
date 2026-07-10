import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVE_COMPETITION_ID } from "./constants";
import type { AdminCompetition, AdminCompetitionEntry } from "./adminTypes";
import type { LiveCompetitionOrderBy } from "./types";

function getAdminClient() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Admin database access is not configured.");
  }
  return admin;
}

function mapAdminCompetition(row: Record<string, unknown>): AdminCompetition {
  const orderBy = row.order_by;
  if (orderBy !== "weight" && orderBy !== "time") {
    throw new Error(`Invalid order_by value: ${orderBy}`);
  }

  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    additionalInfo: String(row.additional_info ?? ""),
    linkText: String(row.link_text ?? ""),
    orderBy: orderBy as LiveCompetitionOrderBy,
    theme: {
      borderColor: String(row.theme_border_color ?? "#FF3801"),
      bgColor: String(row.theme_bg_color ?? "#FF3801"),
      copyColor: String(row.theme_copy_color ?? "#000000"),
      linkColor: String(row.theme_link_color ?? "#000000"),
      linkTextColor: String(row.theme_link_text_color ?? "#FFFFFF"),
    },
    activeInTest: row.active_in_test === true,
    activeInProduction: row.active_in_production === true,
  };
}

function mapAdminEntry(row: Record<string, unknown>): AdminCompetitionEntry {
  const score = Number(row.score);
  if (!Number.isFinite(score)) {
    throw new Error(`Invalid score for entry: ${row.name}`);
  }

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    score,
    category: String(row.category ?? ""),
  };
}

export async function fetchAdminCompetition(): Promise<AdminCompetition | null> {
  const admin = getAdminClient();

  const { data, error } = await admin
    .from("active_competition")
    .select("*")
    .eq("id", ACTIVE_COMPETITION_ID)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapAdminCompetition(data as Record<string, unknown>);
}

export async function fetchAdminCompetitionEntries(): Promise<AdminCompetitionEntry[]> {
  const admin = getAdminClient();

  const { data, error } = await admin
    .from("competition_entry")
    .select("id, name, score, category")
    .eq("competition_id", ACTIVE_COMPETITION_ID)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapAdminEntry(row as Record<string, unknown>)
  );
}

export function sortEntriesForAdmin(
  entries: AdminCompetitionEntry[],
  orderBy: LiveCompetitionOrderBy
): AdminCompetitionEntry[] {
  return [...entries].sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category, undefined, {
      sensitivity: "base",
    });
    if (categoryCompare !== 0) return categoryCompare;

    if (orderBy === "weight") {
      return b.score - a.score;
    }

    return a.score - b.score;
  });
}
