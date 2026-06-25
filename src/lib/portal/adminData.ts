import { createAdminClient } from "@/lib/supabase/admin";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";
import { mapEntity, type EntityRow } from "@/lib/portal/db";
import type { PortalEntityKind, PortalEntityStatus } from "@/lib/portal/types";

export type AdminOwnerInfo = {
  displayName: string | null;
  email: string | null;
};

export type AdminPendingItem = {
  kind: PortalEntityKind;
  entity: EntityRow;
};

export type AdminPendingCounts = Record<PortalEntityKind, number> & {
  total: number;
};

const ENTITY_KINDS: PortalEntityKind[] = ["gyms", "clubs", "coaches"];

function getAdminClient() {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Admin database access is not configured.");
  }
  return admin;
}

export async function fetchAdminEntities(
  kind: PortalEntityKind,
  status?: PortalEntityStatus | "all"
): Promise<{ items: EntityRow[]; error: string | null }> {
  try {
    const admin = getAdminClient();
    let query = admin
      .from(ENTITY_CONFIGS[kind].table)
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      return { items: [], error: error.message };
    }

    return {
      items: (data ?? []).map((row) =>
        mapEntity(kind, row as Record<string, unknown>)
      ),
      error: null,
    };
  } catch (err) {
    return {
      items: [],
      error: err instanceof Error ? err.message : "Failed to load listings.",
    };
  }
}

export async function fetchAdminEntity(
  kind: PortalEntityKind,
  id: string
): Promise<{ entity: EntityRow | null; error: string | null }> {
  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from(ENTITY_CONFIGS[kind].table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { entity: null, error: error.message };
    }

    if (!data) {
      return { entity: null, error: null };
    }

    return {
      entity: mapEntity(kind, data as Record<string, unknown>),
      error: null,
    };
  } catch (err) {
    return {
      entity: null,
      error: err instanceof Error ? err.message : "Failed to load listing.",
    };
  }
}

export async function fetchAdminPendingCounts(): Promise<AdminPendingCounts> {
  const counts: AdminPendingCounts = {
    gyms: 0,
    clubs: 0,
    coaches: 0,
    total: 0,
  };

  try {
    const admin = getAdminClient();

    await Promise.all(
      ENTITY_KINDS.map(async (kind) => {
        const { count, error } = await admin
          .from(ENTITY_CONFIGS[kind].table)
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (!error && count != null) {
          counts[kind] = count;
          counts.total += count;
        }
      })
    );
  } catch {
    // Return zero counts when admin is not configured.
  }

  return counts;
}

export async function fetchAllPendingEntities(): Promise<AdminPendingItem[]> {
  const items: AdminPendingItem[] = [];

  try {
    const admin = getAdminClient();

    await Promise.all(
      ENTITY_KINDS.map(async (kind) => {
        const { data, error } = await admin
          .from(ENTITY_CONFIGS[kind].table)
          .select("*")
          .eq("status", "pending")
          .order("submitted_at", { ascending: true, nullsFirst: false });

        if (error || !data) return;

        for (const row of data) {
          items.push({
            kind,
            entity: mapEntity(kind, row as Record<string, unknown>),
          });
        }
      })
    );
  } catch {
    return [];
  }

  return items.sort((a, b) => {
    const aTime = a.entity.submitted_at
      ? new Date(a.entity.submitted_at).getTime()
      : 0;
    const bTime = b.entity.submitted_at
      ? new Date(b.entity.submitted_at).getTime()
      : 0;
    return aTime - bTime;
  });
}

export async function fetchOwnerInfo(ownerId: string): Promise<AdminOwnerInfo> {
  try {
    const admin = getAdminClient();

    const [profileResult, authResult] = await Promise.all([
      admin
        .from("portal_profiles")
        .select("display_name")
        .eq("id", ownerId)
        .maybeSingle(),
      admin.auth.admin.getUserById(ownerId),
    ]);

    return {
      displayName: profileResult.data?.display_name ?? null,
      email: authResult.data.user?.email ?? null,
    };
  } catch {
    return { displayName: null, email: null };
  }
}
