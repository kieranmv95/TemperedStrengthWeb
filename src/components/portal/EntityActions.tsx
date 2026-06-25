import Link from "next/link";
import {
  canDeleteEntity,
  canSubmitForReview,
} from "@/lib/portal/access";
import type { PortalEntityKind, PortalEntityStatus } from "@/lib/portal/types";
import { deleteEntity, submitEntityForReview } from "@/app/portal/actions";

type Props = {
  kind: PortalEntityKind;
  id: string;
  status: PortalEntityStatus;
};

export function EntityActions({ kind, id, status }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {canSubmitForReview(status) ? (
        <form action={submitEntityForReview.bind(null, kind, id)}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg border border-[#c9b072]/40 bg-[#c9b072]/10 px-4 py-2 text-sm font-semibold text-[#d4c08a] hover:bg-[#c9b072]/20 transition-colors"
          >
            Submit for review
          </button>
        </form>
      ) : null}

      {canDeleteEntity(status) ? (
        <form action={deleteEntity.bind(null, kind, id)}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg border border-red-900/50 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950/40 transition-colors"
          >
            Delete draft
          </button>
        </form>
      ) : null}

      <Link
        href={`/portal/${kind}`}
        className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        Back to list
      </Link>
    </div>
  );
}
