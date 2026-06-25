import type { PortalEntityStatus } from "@/lib/portal/types";

const styles: Record<PortalEntityStatus, string> = {
  draft: "border-neutral-700 bg-neutral-900/60 text-neutral-300",
  pending: "border-amber-700/50 bg-amber-950/40 text-amber-200",
  approved: "border-emerald-700/50 bg-emerald-950/40 text-emerald-200",
  rejected: "border-red-700/50 bg-red-950/40 text-red-200",
};

type Props = {
  status: PortalEntityStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: Props) {
  const label =
    status === "draft"
      ? "Draft"
      : status === "pending"
        ? "Pending review"
        : status === "approved"
          ? "Approved"
          : "Rejected";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[status]} ${className}`}
    >
      {label}
    </span>
  );
}
