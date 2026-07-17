"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createPromoCode } from "@/app/portal/(authenticated)/admin/promo-codes/actions";
import { useScrollOnError } from "@/components/portal/useScrollOnError";

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type FormState = {
  error: string | null;
  saved: boolean;
  resetKey: number;
};

export function PromoCodeCreateForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createPromoCode(formData);

      if (result.ok) {
        router.refresh();
        return { error: null, saved: true, resetKey: prev.resetKey + 1 };
      }

      return { error: result.error, saved: false, resetKey: prev.resetKey };
    },
    { error: null, saved: false, resetKey: 0 }
  );

  useScrollOnError(state.error);

  return (
    <form
      key={state.resetKey}
      action={formAction}
      className="space-y-4 rounded-lg border border-[#c9b072]/25 bg-[#c9b072]/5 p-4"
    >
      <div>
        <p className="text-sm font-semibold text-white">Create promo code</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          Example: RAINHILL · 10 uses · 365 days. Codes are stored uppercase.
        </p>
      </div>

      {state.error ? (
        <div
          className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-100"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      {state.saved ? (
        <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100">
          Code created.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Code</span>
          <input
            type="text"
            name="code"
            required
            placeholder="RAINHILL"
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Max redemptions
          </span>
          <input
            type="number"
            name="max_redemptions"
            required
            min={1}
            step={1}
            placeholder="10"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Days granted
          </span>
          <input
            type="number"
            name="days_granted"
            required
            min={1}
            step={1}
            placeholder="365"
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Password (optional)
          </span>
          <input
            type="password"
            name="password"
            placeholder="Leave blank for none"
            className={inputClass}
            autoComplete="new-password"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors sm:w-auto"
      >
        {isPending ? "Creating…" : "Create code"}
      </button>
    </form>
  );
}
