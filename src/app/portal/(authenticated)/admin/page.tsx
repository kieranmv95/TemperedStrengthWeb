import Link from "next/link";
import { AdminEntityRow } from "@/components/portal/admin/AdminEntityRow";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";
import {
  fetchAdminPendingCounts,
  fetchAllPendingEntities,
} from "@/lib/portal/adminData";
import type { PortalEntityKind } from "@/lib/portal/types";

export default async function AdminDashboardPage() {
  const [counts, pending] = await Promise.all([
    fetchAdminPendingCounts(),
    fetchAllPendingEntities(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Partner review
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Review pending gym, club, and coach submissions. Approved listings go
          live in the app automatically.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["gyms", "clubs", "coaches"] as const).map((kind) => {
          const config = ENTITY_CONFIGS[kind];
          const pendingCount = counts[kind];

          return (
            <Link
              key={kind}
              href={`/portal/admin/${kind}?status=pending`}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-[#c9b072]/35"
            >
              <p className="text-sm font-semibold text-white">{config.plural}</p>
              <p className="mt-2 text-3xl font-bold text-white">{pendingCount}</p>
              <p className="mt-1 text-xs text-neutral-500">pending review</p>
            </Link>
          );
        })}
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Pending queue
              {counts.total > 0 ? (
                <span className="ml-2 text-base font-normal text-neutral-500">
                  ({counts.total})
                </span>
              ) : null}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Oldest submissions first.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["gyms", "clubs", "coaches"] as const).map((kind) => (
              <Link
                key={kind}
                href={`/portal/admin/${kind}`}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-sm font-semibold text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
              >
                All {ENTITY_CONFIGS[kind].plural.toLowerCase()}
              </Link>
            ))}
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-10 text-center text-sm text-neutral-500">
            No pending submissions — you&apos;re all caught up.
          </div>
        ) : (
          <div className="grid gap-3">
            {pending.map(({ kind, entity }) => (
              <AdminEntityRow
                key={`${kind}-${entity.id}`}
                kind={kind}
                entity={entity}
                showSubmittedAt
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
