"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createCompetitionEntry } from "@/app/portal/(authenticated)/admin/competition/actions";
import { CompetitionConditionsOfEntryLink } from "@/components/portal/admin/competition/CompetitionConditionsOfEntryLink";
import { useScrollOnError } from "@/components/portal/useScrollOnError";
import { getMetricConfig } from "@/lib/liveCompetition/metrics";
import type { LiveCompetitionMetricType } from "@/lib/liveCompetition/metrics";

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type FormState = {
  error: string | null;
  saved: boolean;
  resetKey: number;
};

type Props = {
  metricType: LiveCompetitionMetricType;
  categories: string[];
};

export function CompetitionAddEntryForm({ metricType, categories }: Props) {
  const router = useRouter();
  const metric = getMetricConfig(metricType);

  const [state, formAction, isPending] = useActionState(
    async (prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createCompetitionEntry(formData);

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
        <p className="text-sm font-semibold text-white">Add entry</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          Quick add during the event. Entries appear in the app after save.{" "}
          <CompetitionConditionsOfEntryLink />
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
          Entry added.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Name</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Athlete name"
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Score</span>
          <input
            type="number"
            name="score"
            required
            min={0}
            step="any"
            inputMode="decimal"
            placeholder={metric.scorePlaceholder}
            className={inputClass}
          />
          <span className="mt-1 block text-[10px] text-neutral-500">{metric.scoreHint}</span>
        </label>

        <label className="block sm:col-span-3">
          <span className="mb-1 block text-xs font-medium text-neutral-400">Category</span>
          <input
            type="text"
            name="category"
            required
            list="competition-categories"
            placeholder="e.g. Male"
            className={inputClass}
            autoComplete="off"
          />
          {categories.length > 0 ? (
            <datalist id="competition-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          ) : null}
        </label>

        <label className="block sm:col-span-3">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Contact
          </span>
          <input
            type="text"
            name="contact"
            placeholder="Phone, email, or Instagram"
            className={inputClass}
            autoComplete="off"
          />
          <span className="mt-1 block text-[10px] text-neutral-500">
            Admin only — not shown in the app.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors sm:w-auto"
      >
        {isPending ? "Adding…" : "Add entry"}
      </button>
    </form>
  );
}
