"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCompetitionEntry,
  updateCompetitionEntry,
} from "@/app/portal/(authenticated)/admin/competition/actions";
import { CategoryPicker } from "@/components/portal/admin/competition/CategoryPicker";
import type { AdminCompetitionEntry } from "@/lib/liveCompetition/adminTypes";
import {
  formatScoreForDisplay,
  type LiveCompetitionMetricType,
} from "@/lib/liveCompetition/metrics";

const inputClass =
  "w-full min-h-12 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-3 text-base text-white focus:border-[#c9b072]/50 focus:outline-none sm:min-h-0 sm:px-2.5 sm:py-1.5 sm:text-sm";

type RowState = {
  error: string | null;
  saved: boolean;
};

type Props = {
  entry: AdminCompetitionEntry;
  rank: number;
  metricType: LiveCompetitionMetricType;
  categories: string[];
};

export function CompetitionEntryRow({
  entry,
  rank,
  metricType,
  categories,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState(entry.category);
  const updateAction = updateCompetitionEntry.bind(null, entry.id);
  const deleteAction = deleteCompetitionEntry.bind(null, entry.id);

  const [updateState, updateFormAction, isUpdating] = useActionState(
    async (_prev: RowState, formData: FormData): Promise<RowState> => {
      const result = await updateAction(formData);

      if (result.ok) {
        router.refresh();
        setIsEditing(false);
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
  const displayScore = formatScoreForDisplay(entry.score, metricType);
  const isLeader = rank === 1;

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 ${
        isLeader
          ? "border-[#c9b072]/35 bg-[#c9b072]/8"
          : "border-neutral-800/80 bg-neutral-950/40"
      }`}
    >
      {error ? (
        <p className="mb-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      {isEditing ? (
        <form action={updateFormAction} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Name
              </span>
              <input
                type="text"
                name="name"
                required
                defaultValue={entry.name}
                className={inputClass}
                autoComplete="off"
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Score
              </span>
              <input
                type="number"
                name="score"
                required
                min={0}
                step="any"
                inputMode="decimal"
                defaultValue={entry.score}
                className={inputClass}
              />
            </label>
          </div>

          <div className="block min-w-0">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Category
            </span>
            <CategoryPicker
              categories={categories}
              value={category}
              onChange={setCategory}
              required
              inputClassName={inputClass}
            />
          </div>

          <label className="block min-w-0">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Contact
            </span>
            <input
              type="text"
              name="contact"
              defaultValue={entry.contact ?? ""}
              placeholder="Phone, email, or Instagram"
              className={inputClass}
              autoComplete="off"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-50 sm:flex-none"
            >
              {isUpdating ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setCategory(entry.category);
                setIsEditing(false);
              }}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:border-neutral-500 disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          <span
            className={`w-8 shrink-0 pt-0.5 text-center text-lg font-bold tabular-nums sm:w-9 sm:text-xl ${
              isLeader ? "text-[#c9b072]" : "text-neutral-500"
            }`}
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold leading-snug text-white sm:text-lg">
                {entry.name}
              </p>
              <p
                className={`shrink-0 text-lg font-bold tabular-nums leading-snug sm:text-xl ${
                  isLeader ? "text-[#d4c08a]" : "text-white"
                }`}
              >
                {displayScore}
              </p>
            </div>
            {entry.contact ? (
              <p className="mt-1 truncate text-sm text-neutral-400">
                {entry.contact}
              </p>
            ) : (
              <p className="mt-1 text-sm text-neutral-600">No contact</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setIsEditing(true)}
                className="inline-flex min-h-10 items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white hover:border-[#c9b072]/40 disabled:opacity-50"
              >
                Edit
              </button>
              <form
                action={deleteFormAction}
                onSubmit={(event) => {
                  if (
                    !window.confirm(
                      `Remove ${entry.name} from the leaderboard?`
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-10 items-center rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-sm font-semibold text-red-300 hover:border-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Removing…" : "Remove"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
