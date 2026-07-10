import { createAdminClient } from "@/lib/supabase/admin";
import {
  mapActiveCompetitionRow,
  type CompetitionEnvironment,
  type LiveCompetition,
} from "./types";

export const LIVE_COMPETITION_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
};

export function parseCompetitionEnvironment(
  value: string | null
): CompetitionEnvironment | null {
  if (value === "test" || value === "production") {
    return value;
  }
  return null;
}

export async function getLiveCompetition(
  environment: CompetitionEnvironment
): Promise<LiveCompetition | null> {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const activeFlag =
    environment === "test" ? "active_in_test" : "active_in_production";

  const { data: competition, error: competitionError } = await supabase
    .from("active_competition")
    .select(
      "title, description, additional_info, link_text, order_by, theme_border_color, theme_bg_color, theme_copy_color, theme_link_color, theme_link_text_color"
    )
    .eq("id", 1)
    .eq(activeFlag, true)
    .maybeSingle();

  if (competitionError) {
    throw new Error(competitionError.message);
  }

  if (!competition) {
    return null;
  }

  const { data: entries, error: entriesError } = await supabase
    .from("competition_entry")
    .select("name, score, category")
    .eq("competition_id", 1);

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  return mapActiveCompetitionRow(competition, entries ?? []);
}
