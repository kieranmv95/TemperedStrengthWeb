import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/portal/EntityCard";
import type { EntityConfig } from "@/lib/portal/constants";
import { mapEntity } from "@/lib/portal/db";
import type { PortalEntityKind } from "@/lib/portal/types";
import { createClient } from "@/lib/supabase/server";

type Props = {
  config: EntityConfig;
};

export async function EntityListView({ config }: Props) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
        Could not load {config.plural.toLowerCase()}: {error.message}
      </div>
    );
  }

  const items = (data ?? []).map((row) =>
    mapEntity(config.kind as PortalEntityKind, row)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/portal"
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            ← Portal home
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">{config.plural}</h1>
          <p className="mt-2 text-neutral-400">{config.description}</p>
        </div>
        <Link
          href={`/portal/${config.kind}/new`}
          className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d4c08a] transition-colors"
        >
          Add {config.singular}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-10 text-center">
          <p className="text-neutral-400">No {config.plural.toLowerCase()} yet.</p>
          <Link
            href={`/portal/${config.kind}/new`}
            className="mt-4 inline-flex text-sm font-semibold text-[#c9b072] hover:underline"
          >
            Create your first {config.singular}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <EntityCard
              key={item.id}
              kind={config.kind}
              id={item.id}
              name={item.name}
              status={item.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export async function fetchOwnedEntity(
  kind: PortalEntityKind,
  id: string,
  config: EntityConfig
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return mapEntity(kind, data);
}

export function invalidEntityId(id: string) {
  if (!id || id === "new") notFound();
}
