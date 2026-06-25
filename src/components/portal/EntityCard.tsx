import Link from "next/link";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { getStatusCopy } from "@/lib/portal/statusCopy";
import type { PortalEntityKind, PortalEntityStatus } from "@/lib/portal/types";

type Props = {
  kind: PortalEntityKind;
  id: string;
  name: string;
  status: PortalEntityStatus;
};

export function EntityCard({ kind, id, name, status }: Props) {
  const { title } = getStatusCopy(status);

  return (
    <Link
      href={`/portal/${kind}/${id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 hover:border-[#c9b072]/35 transition-colors"
    >
      <div className="min-w-0">
        <p className="font-semibold text-white">{name}</p>
        <p className="mt-1 text-sm text-neutral-500 truncate">{title}</p>
      </div>
      <StatusBadge status={status} className="shrink-0" />
    </Link>
  );
}
