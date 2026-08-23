"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createCompetitionEntry } from "@/app/portal/(authenticated)/admin/competition/actions";
import { CategoryPicker } from "@/components/portal/admin/competition/CategoryPicker";
import { CompetitionConditionsOfEntryLink } from "@/components/portal/admin/competition/CompetitionConditionsOfEntryLink";
import { useScrollOnError } from "@/components/portal/useScrollOnError";
import { getMetricConfig } from "@/lib/liveCompetition/metrics";
import type { LiveCompetitionMetricType } from "@/lib/liveCompetition/metrics";

const inputClass =
  "w-full min-h-12 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-base text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none sm:min-h-0 sm:py-2.5 sm:text-sm";

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
  const [category, setCategory] = useState("");

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
      className="space-y-4 rounded-xl border border-[#c9b072]/25 bg-[#c9b072]/5 p-4 sm:p-5"
    >
      <div>
        <p className="text-base font-semibold text-white sm:text-sm">Add entry</p>
        <p className="mt-0.5 text-sm text-neutral-500 sm:text-xs">
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

      <div className="grid gap-4 md:grid-cols-[1fr_8.5rem]">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-sm font-medium text-neutral-300 sm:text-xs sm:text-neutral-400">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder="Athlete name"
            className={inputClass}
            autoComplete="off"
            autoCapitalize="words"
          />
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-sm font-medium text-neutral-300 sm:text-xs sm:text-neutral-400">
            Score
          </span>
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
          <span className="mt-1 block text-xs text-neutral-500">
            {metric.scoreHint}
          </span>
        </label>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-neutral-300 sm:text-xs sm:text-neutral-400">
          Category
        </span>
        <CategoryPicker
          categories={categories}
          value={category}
          onChange={setCategory}
          required
        />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-neutral-300 sm:text-xs sm:text-neutral-400">
          Contact
        </span>
        <input
          type="text"
          name="contact"
          placeholder="Phone, email, or Instagram"
          className={inputClass}
          autoComplete="off"
        />
        <span className="mt-1 block text-xs text-neutral-500">
          Staff only — not shown in the app.
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#c9b072] px-4 py-3 text-base font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors sm:min-h-0 sm:w-auto sm:py-2.5 sm:text-sm"
      >
        {isPending ? "Adding…" : "Add entry"}
      </button>
    </form>
  );
}
