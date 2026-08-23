import { CompetitionAddEntryForm } from "@/components/portal/admin/competition/CompetitionAddEntryForm";
import { CompetitionEntryRow } from "@/components/portal/admin/competition/CompetitionEntryRow";
import {
  uniqueCompetitionCategories,
} from "@/lib/liveCompetition/adminData";
import type { AdminCompetitionEntry } from "@/lib/liveCompetition/adminTypes";
import { getSortDescription } from "@/lib/liveCompetition/metrics";
import type { LiveCompetitionMetricType } from "@/lib/liveCompetition/metrics";

type Props = {
  entries: AdminCompetitionEntry[];
  metricType: LiveCompetitionMetricType;
};

function groupEntries(entries: AdminCompetitionEntry[]) {
  const categories = uniqueCompetitionCategories(entries);

  const grouped = categories.map((category) => ({
    category,
    entries: entries.filter(
      (entry) =>
        entry.category.trim().toLowerCase() === category.toLowerCase()
    ),
  }));

  const uncategorised = entries.filter((entry) => !entry.category.trim());

  return { categories, grouped, uncategorised };
}

export function CompetitionEntriesSection({ entries, metricType }: Props) {
  const { categories, grouped, uncategorised } = groupEntries(entries);
  const sortHint = getSortDescription(metricType);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Leaderboard entries</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
          {categories.length > 0
            ? ` across ${categories.length} ${
                categories.length === 1 ? "category" : "categories"
              }`
            : ""}
          . Sorted {sortHint}.
        </p>
      </div>

      <CompetitionAddEntryForm metricType={metricType} categories={categories} />

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-8 text-center text-sm text-neutral-500">
          No entries yet. Add athletes above as scores come in.
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white">Current leaders</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Ranked within each category. Tap Edit if a score or name needs a
              fix.
            </p>
          </div>

          {grouped.map(({ category, entries: categoryEntries }) => (
            <section
              key={category}
              className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/50"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <h4 className="text-base font-semibold text-[#d4c08a]">
                  {category}
                </h4>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {categoryEntries.length}{" "}
                  {categoryEntries.length === 1 ? "athlete" : "athletes"}
                </p>
              </div>
              <div className="space-y-2 p-3 sm:p-4">
                {categoryEntries.map((entry, index) => (
                  <CompetitionEntryRow
                    key={entry.id}
                    entry={entry}
                    rank={index + 1}
                    metricType={metricType}
                    categories={categories}
                  />
                ))}
              </div>
            </section>
          ))}

          {uncategorised.length > 0 ? (
            <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/50">
              <div className="flex items-baseline justify-between gap-3 border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
                <h4 className="text-base font-semibold text-neutral-400">
                  Uncategorized
                </h4>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {uncategorised.length}{" "}
                  {uncategorised.length === 1 ? "athlete" : "athletes"}
                </p>
              </div>
              <div className="space-y-2 p-3 sm:p-4">
                {uncategorised.map((entry, index) => (
                  <CompetitionEntryRow
                    key={entry.id}
                    entry={entry}
                    rank={index + 1}
                    metricType={metricType}
                    categories={categories}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}
