"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCompetitionEntry,
  updateCompetitionEntry,
} from "@/app/portal/(authenticated)/admin/competition/actions";
import type { AdminCompetitionEntry } from "@/lib/liveCompetition/adminTypes";
import {
  formatScoreForDisplay,
  type LiveCompetitionMetricType,
} from "@/lib/liveCompetition/metrics";

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-sm text-white focus:border-[#c9b072]/50 focus:outline-none";

type RowState = {
  error: string | null;
  saved: boolean;
};

type Props = {
  entry: AdminCompetitionEntry;
  metricType: LiveCompetitionMetricType;
  categories: string[];
};

export function CompetitionEntryRow({ entry, metricType, categories }: Props) {
  const router = useRouter();
  const updateAction = updateCompetitionEntry.bind(null, entry.id);
  const deleteAction = deleteCompetitionEntry.bind(null, entry.id);

  const [updateState, updateFormAction, isUpdating] = useActionState(
    async (_prev: RowState, formData: FormData): Promise<RowState> => {
      const result = await updateAction(formData);

      if (result.ok) {
        router.refresh();
        return { error: null, saved: true };
      }

      return { error: result.error, saved: false };
    },
    { error: null, saved: false }
  );

  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    async (): Promise<RowState> => {
      const result = await deleteAction();

      if (result.ok) {
        router.refresh();
        return { error: null, saved: true };
      }

      return { error: result.error, saved: false };
    },
    { error: null, saved: false }
  );

  const busy = isUpdating || isDeleting;
  const error = updateState.error ?? deleteState.error;

  return (
    <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
      {error ? (
        <p className="mb-2 text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {updateState.saved ? (
        <p className="mb-2 text-xs text-emerald-300/90">Saved.</p>
      ) : null}

      <form action={updateFormAction} className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-[1fr_6rem_6rem]">
          <label className="block min-w-0">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Name
            </span>
            <input
              type="text"
              name="name"
              required
              defaultValue={entry.name}
              className={inputClass}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Score
            </span>
            <input
              type="number"
              name="score"
              required
              min={0}
              step="any"
              defaultValue={entry.score}
              className={inputClass}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Category
            </span>
            <input
              type="text"
              name="category"
              required
              list={`competition-categories-${entry.id}`}
              defaultValue={entry.category}
              className={inputClass}
            />
            {categories.length > 0 ? (
              <datalist id={`competition-categories-${entry.id}`}>
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            ) : null}
          </label>

          <label className="block min-w-0 sm:col-span-3">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Contact
            </span>
            <input
              type="text"
              name="contact"
              defaultValue={entry.contact ?? ""}
              placeholder="Phone, email, or Instagram"
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-neutral-500 tabular-nums">
            App display: {formatScoreForDisplay(entry.score, metricType)}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#c9b072]/40 disabled:opacity-50"
            >
              {isUpdating ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>

      <form
        action={deleteFormAction}
        className="mt-2 border-t border-neutral-800/60 pt-2"
        onSubmit={(e) => {
          if (
            !window.confirm(`Remove ${entry.name} from the leaderboard?`)
          ) {
            e.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          disabled={busy}
          className="text-xs font-medium text-red-300 hover:underline disabled:opacity-50"
        >
          {isDeleting ? "Removing…" : "Remove entry"}
        </button>
      </form>
    </div>
  );
}
