import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEntityRow } from "@/components/portal/admin/AdminEntityRow";
import { AdminStatusFilters } from "@/components/portal/admin/AdminStatusFilters";
import { requirePortalAdmin } from "@/lib/portal/adminAccess";
import { ENTITY_CONFIGS, isPortalEntityKind } from "@/lib/portal/constants";
import { fetchAdminEntities } from "@/lib/portal/adminData";
import type { PortalEntityStatus } from "@/lib/portal/types";

type Props = {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ status?: string }>;
};

function parseStatus(value: string | undefined): PortalEntityStatus | "all" {
  if (
    value === "draft" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }
  return "all";
}

export default async function AdminEntityListPage({ params, searchParams }: Props) {
  await requirePortalAdmin();
  const { kind: kindParam } = await params;
  const { status: statusParam } = await searchParams;

  if (!isPortalEntityKind(kindParam)) {
    notFound();
  }

  const kind = kindParam;
  const status = parseStatus(statusParam);
  const config = ENTITY_CONFIGS[kind];
  const { items, error } = await fetchAdminEntities(kind, status);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/portal/admin"
          className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
        >
          ← Review dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {config.plural}
        </h1>
        <p className="mt-2 text-neutral-400">
          All {config.plural.toLowerCase()} on the platform.
        </p>
      </div>

      <AdminStatusFilters basePath={`/portal/admin/${kind}`} current={status} />

      {error ? (
        <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          Could not load listings: {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-10 text-center text-sm text-neutral-500">
          No {config.plural.toLowerCase()}
          {status === "all" ? "" : ` with status “${status}”`}.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((entity) => (
            <AdminEntityRow
              key={entity.id}
              kind={kind}
              entity={entity}
              showSubmittedAt={status === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
