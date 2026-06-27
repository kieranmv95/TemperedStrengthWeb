"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { rejectEntity } from "@/app/portal/(authenticated)/admin/actions";
import type { PortalEntityKind } from "@/lib/portal/types";

type FormState = {
  error: string | null;
};

type Props = {
  kind: PortalEntityKind;
  id: string;
  initialError?: string;
};

export function AdminRejectForm({ kind, id, initialError }: Props) {
  const router = useRouter();
  const action = rejectEntity.bind(null, kind, id);

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await action(formData);

      if (result.ok) {
        router.push(result.redirectTo);
        router.refresh();
        return { error: null };
      }

      return { error: result.error };
    },
    { error: initialError ?? null }
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      {state.error ? (
        <div
          className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">
          Rejection note
        </span>
        <textarea
          name="rejection_note"
          rows={4}
          placeholder="e.g. Please add a complete street address and opening hours."
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg border border-red-800/60 bg-red-950/50 px-5 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-900/50 disabled:opacity-60 transition-colors sm:w-auto"
      >
        {isPending ? "Rejecting…" : "Reject listing"}
      </button>
    </form>
  );
}
