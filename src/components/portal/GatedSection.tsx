import { APPROVAL_SLA } from "@/lib/portal/statusCopy";
import { canAccessApprovedDashboard } from "@/lib/portal/access";
import type { PortalEntityStatus } from "@/lib/portal/types";
import { StatusBadge } from "./StatusBadge";

type Props = {
  status: PortalEntityStatus;
  entityLabel: string;
  children: React.ReactNode;
};

export function GatedSection({ status, entityLabel, children }: Props) {
  if (!canAccessApprovedDashboard(status)) {
    return (
      <section className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Partner dashboard</h2>
          <StatusBadge status={status} />
        </div>
        <p className="mt-3 text-sm text-neutral-400">
          {status === "pending"
            ? `This section is locked while your ${entityLabel.toLowerCase()} profile is pending approval. ${APPROVAL_SLA}`
            : status === "rejected"
              ? `This section is locked until your ${entityLabel.toLowerCase()} profile is approved. Update your profile and resubmit for review.`
              : `Submit your ${entityLabel.toLowerCase()} profile for review to unlock partner features.`}{" "}
          {status === "draft" ? APPROVAL_SLA : null}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#c9b072]/25 bg-[#c9b072]/5 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-white">{entityLabel} dashboard</h2>
        <StatusBadge status="approved" />
      </div>
      <p className="mt-2 text-sm text-neutral-300">
        Your profile is approved and partner tools are available here. More
        features are on the way.
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
