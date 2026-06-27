"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { approveEntity } from "@/app/portal/(authenticated)/admin/actions";
import type { PortalEntityKind } from "@/lib/portal/types";

type FormState = {
  error: string | null;
};

type Props = {
  kind: PortalEntityKind;
  id: string;
};

export function AdminApproveButton({ kind, id }: Props) {
  const router = useRouter();
  const action = approveEntity.bind(null, kind, id);

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState): Promise<FormState> => {
      const result = await action();

      if (result.ok) {
        router.push(result.redirectTo);
        router.refresh();
        return { error: null };
      }

      return { error: result.error };
    },
    { error: null }
  );

  return (
    <div className="w-full sm:w-auto">
      {state.error ? (
        <p
          className="mb-2 rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <form action={formAction} className="w-full sm:w-auto">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors sm:w-auto"
        >
          {isPending ? "Approving…" : "Approve listing"}
        </button>
      </form>
    </div>
  );
}
