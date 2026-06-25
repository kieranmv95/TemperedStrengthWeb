import { getStatusCopy } from "@/lib/portal/statusCopy";
import { statusLabel } from "@/lib/portal/access";
import type { PortalEntityStatus } from "@/lib/portal/types";
import { StatusBadge } from "./StatusBadge";

const containerStyles: Record<PortalEntityStatus, string> = {
  draft: "border-neutral-700 bg-neutral-900/60",
  pending: "border-amber-700/50 bg-amber-950/30",
  approved: "border-emerald-700/50 bg-emerald-950/30",
  rejected: "border-red-700/50 bg-red-950/30",
};

const titleStyles: Record<PortalEntityStatus, string> = {
  draft: "text-neutral-200",
  pending: "text-amber-100",
  approved: "text-emerald-100",
  rejected: "text-red-100",
};

const bodyStyles: Record<PortalEntityStatus, string> = {
  draft: "text-neutral-400",
  pending: "text-amber-100/90",
  approved: "text-emerald-100/90",
  rejected: "text-red-100/90",
};

type Props = {
  status: PortalEntityStatus;
  rejectionNote?: string | null;
  submittedAt?: string | null;
};

function formatSubmittedAt(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function StatusBanner({ status, rejectionNote, submittedAt }: Props) {
  const copy = getStatusCopy(status, rejectionNote);

  return (
    <div
      className={`min-w-0 rounded-xl border px-4 py-4 sm:px-5 ${containerStyles[status]}`}
      role="status"
      aria-label={`Account status: ${statusLabel(status)}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Account status
        </p>
        <StatusBadge status={status} />
      </div>

      <h2 className={`mt-3 text-base font-semibold break-words sm:text-lg ${titleStyles[status]}`}>
        {copy.title}
      </h2>

      <p className={`mt-2 text-sm leading-relaxed ${bodyStyles[status]}`}>
        {copy.body}
      </p>

      {status === "pending" && submittedAt ? (
        <p className={`mt-2 text-sm ${bodyStyles[status]}`}>
          Submitted on {formatSubmittedAt(submittedAt)}.
        </p>
      ) : null}

      {copy.nextStep ? (
        <p className={`mt-3 text-sm ${bodyStyles[status]} opacity-90`}>
          {copy.nextStep}
        </p>
      ) : null}
    </div>
  );
}
