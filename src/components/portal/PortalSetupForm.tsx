"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { savePortalDisplayName } from "@/app/portal/actions";

type FormState = {
  error: string | null;
};

type Props = {
  initialError?: string;
};

export function PortalSetupForm({ initialError }: Props) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await savePortalDisplayName(formData);

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
    <form action={formAction} className="mt-6 space-y-4">
      {state.error ? (
        <div
          className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">
          Your name
        </span>
        <input
          type="text"
          name="display_name"
          required
          autoFocus
          maxLength={100}
          placeholder="e.g. Alex or Ironworks Gym"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
      >
        {isPending ? "Saving…" : "Continue to portal"}
      </button>
    </form>
  );
}
