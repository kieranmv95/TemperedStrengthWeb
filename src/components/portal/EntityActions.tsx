import Link from "next/link";
import { DeleteEntityButton } from "@/components/portal/DeleteEntityButton";
import { SubmitForReviewButton } from "@/components/portal/SubmitForReviewButton";
import { canSubmitForReview } from "@/lib/portal/access";
import type { PortalEntityKind, PortalEntityStatus } from "@/lib/portal/types";

type Props = {
  kind: PortalEntityKind;
  id: string;
  name: string;
  entityLabel: string;
  status: PortalEntityStatus;
};

export function EntityActions({
  kind,
  id,
  name,
  entityLabel,
  status,
}: Props) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      {canSubmitForReview(status) ? (
        <SubmitForReviewButton kind={kind} id={id} />
      ) : null}

      <DeleteEntityButton
        kind={kind}
        id={id}
        name={name}
        entityLabel={entityLabel}
      />

      <Link
        href={`/portal/${kind}`}
        className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        Back to list
      </Link>
    </div>
  );
}
