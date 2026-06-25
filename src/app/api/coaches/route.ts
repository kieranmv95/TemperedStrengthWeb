import {
  listApprovedCoaches,
  PUBLIC_LISTING_CACHE_HEADERS,
} from "@/lib/portal/publicApi";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return Response.json(
      { error: "Partner listings are not configured." },
      { status: 503 }
    );
  }

  try {
    const coaches = await listApprovedCoaches();
    return Response.json(coaches, { headers: PUBLIC_LISTING_CACHE_HEADERS });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load coaches.";
    return Response.json({ error: message }, { status: 500 });
  }
}
