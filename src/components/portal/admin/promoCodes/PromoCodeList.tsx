"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deactivatePromoCodeAction,
  deletePromoCodeAction,
} from "@/app/portal/(authenticated)/admin/promo-codes/actions";
import type { AdminPromoCode, AdminPromoRedemption } from "@/lib/promoCodes/types";

type RowState = {
  error: string | null;
};

type Props = {
  codes: AdminPromoCode[];
  redemptionsByCodeId: Record<string, AdminPromoRedemption[]>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PromoCodeRow({
  code,
  redemptions,
}: {
  code: AdminPromoCode;
  redemptions: AdminPromoRedemption[];
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const hasRedemptions = code.remainingRedemptions < code.maxRedemptions;
  const canDelete = !hasRedemptions;

  const deleteAction = deletePromoCodeAction.bind(null, code.id);
  const deactivateAction = deactivatePromoCodeAction.bind(null, code.id);

  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    async (): Promise<RowState> => {
      const result = await deleteAction();
      if (result.ok) {
        router.refresh();
        return { error: null };
      }
      return { error: result.error };
    },
    { error: null }
  );

  const [deactivateState, deactivateFormAction, isDeactivating] = useActionState(
    async (): Promise<RowState> => {
      const result = await deactivateAction();
      if (result.ok) {
        router.refresh();
        return { error: null };
      }
      return { error: result.error };
    },
    { error: null }
  );

  const busy = isDeleting || isDeactivating;
  const error = deleteState.error ?? deactivateState.error;

  return (
    <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/40">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-sm font-semibold text-white">{code.code}</p>
            {!code.isActive ? (
              <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                Inactive
              </span>
            ) : null}
            {code.hasPassword ? (
              <span className="rounded-full border border-amber-800/50 bg-amber-950/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                Password
              </span>
            ) : null}
          </div>
          <p className="text-xs text-neutral-500">
            {code.daysGranted} days · {code.remainingRedemptions} / {code.maxRedemptions}{" "}
            remaining · created {formatDate(code.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasRedemptions ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-[#c9b072]/40"
            >
              {expanded ? "Hide redemptions" : `View redemptions (${redemptions.length})`}
            </button>
          ) : null}

          {canDelete ? (
            <form
              action={deleteFormAction}
              onSubmit={(event) => {
                if (!window.confirm(`Delete code ${code.code}?`)) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                disabled={busy}
                className="rounded-md border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-200 hover:border-red-800 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </form>
          ) : code.isActive ? (
            <form
              action={deactivateFormAction}
              onSubmit={(event) => {
                if (
                  !window.confirm(
                    `Deactivate ${code.code}? Existing redemptions stay in the audit log.`
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                disabled={busy}
                className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-[#c9b072]/40 disabled:opacity-50"
              >
                {isDeactivating ? "Deactivating…" : "Deactivate"}
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="px-4 pb-3 text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {expanded && redemptions.length > 0 ? (
        <div className="border-t border-neutral-800/60 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Redemptions
          </p>
          <div className="space-y-2">
            {redemptions.map((redemption) => (
              <div
                key={redemption.id}
                className="flex flex-col gap-0.5 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-neutral-200">{redemption.email}</span>
                <span className="text-xs text-neutral-500">
                  {formatDate(redemption.redeemedAt)} · {redemption.daysGranted} days
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PromoCodeList({ codes, redemptionsByCodeId }: Props) {
  if (codes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-10 text-center text-sm text-neutral-500">
        No promo codes yet. Create one above.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {codes.map((code) => (
        <PromoCodeRow
          key={code.id}
          code={code}
          redemptions={redemptionsByCodeId[code.id] ?? []}
        />
      ))}
    </div>
  );
}
