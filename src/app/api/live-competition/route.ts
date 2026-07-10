import {
  getLiveCompetition,
  LIVE_COMPETITION_CACHE_HEADERS,
  parseCompetitionEnvironment,
} from "@/lib/liveCompetition/api";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return Response.json(
      { error: "Live competition is not configured." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const environment = parseCompetitionEnvironment(searchParams.get("environment"));

  if (!environment) {
    return Response.json(
      {
        error:
          'Query param "environment" is required and must be "test" or "production".',
      },
      { status: 400 }
    );
  }

  try {
    const competition = await getLiveCompetition(environment);

    if (!competition) {
      return Response.json({ error: "No active competition" }, { status: 404 });
    }

    return Response.json(competition, { headers: LIVE_COMPETITION_CACHE_HEADERS });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load live competition.";
    return Response.json({ error: message }, { status: 500 });
  }
}
