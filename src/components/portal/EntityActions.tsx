import Link from "next/link";
import { DeleteEntityButton } from "@/components/portal/DeleteEntityButton";
import { canSubmitForReview } from "@/lib/portal/access";
import type { PortalEntityKind, PortalEntityStatus } from "@/lib/portal/types";
import { submitEntityForReview } from "@/app/portal/actions";

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
        <form action={submitEntityForReview.bind(null, kind, id)} className="w-full sm:w-auto">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#c9b072]/40 bg-[#c9b072]/10 px-4 py-2 text-sm font-semibold text-[#d4c08a] hover:bg-[#c9b072]/20 transition-colors sm:w-auto"
          >
            Submit for review
          </button>
        </form>
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
