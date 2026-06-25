import Link from "next/link";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { EntityRow } from "@/lib/portal/db";
import type { PortalEntityKind } from "@/lib/portal/types";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";

type Props = {
  kind: PortalEntityKind;
  entity: EntityRow;
  showSubmittedAt?: boolean;
};

function formatWhen(iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminEntityRow({ kind, entity, showSubmittedAt = false }: Props) {
  const config = ENTITY_CONFIGS[kind];
  const submitted = formatWhen(entity.submitted_at);

  return (
    <Link
      href={`/portal/admin/${kind}/${entity.id}`}
      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-[#c9b072]/35 sm:gap-4"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-white break-words">{entity.name}</p>
          <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
            {config.label}
          </span>
        </div>
        {showSubmittedAt && submitted ? (
          <p className="mt-1 text-sm text-neutral-500">Submitted {submitted}</p>
        ) : (
          <p className="mt-1 text-sm text-neutral-500">
            Updated {formatWhen(entity.updated_at)}
          </p>
        )}
      </div>
      <StatusBadge status={entity.status} className="shrink-0" />
    </Link>
  );
}
