import { CompetitionAddEntryForm } from "@/components/portal/admin/competition/CompetitionAddEntryForm";
import { CompetitionEntryRow } from "@/components/portal/admin/competition/CompetitionEntryRow";
import type { AdminCompetitionEntry } from "@/lib/liveCompetition/adminTypes";
import type { LiveCompetitionOrderBy } from "@/lib/liveCompetition/types";

type Props = {
  entries: AdminCompetitionEntry[];
  orderBy: LiveCompetitionOrderBy;
};

export function CompetitionEntriesSection({ entries, orderBy }: Props) {
  const categories = [...new Set(entries.map((entry) => entry.category))].sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const grouped = categories.map((category) => ({
    category,
    entries: entries.filter((entry) => entry.category === category),
  }));

  const uncategorised = entries.filter(
    (entry) => !entry.category.trim()
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Leaderboard entries</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}.
          Sorted for admin preview — the app sorts per category using{" "}
          <span className="text-neutral-400">
            {orderBy === "weight" ? "highest score first" : "lowest time first"}
          </span>
          .
        </p>
      </div>

      <CompetitionAddEntryForm orderBy={orderBy} categories={categories} />

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-8 text-center text-sm text-neutral-500">
          No entries yet. Add athletes above as scores come in.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ category, entries: categoryEntries }) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#c9b072]">
                {category}
                <span className="ml-2 text-neutral-500">({categoryEntries.length})</span>
              </h3>
              <div className="space-y-2">
                {categoryEntries.map((entry) => (
                  <CompetitionEntryRow
                    key={entry.id}
                    entry={entry}
                    orderBy={orderBy}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          ))}

          {uncategorised.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Uncategorized
              </h3>
              <div className="space-y-2">
                {uncategorised.map((entry) => (
                  <CompetitionEntryRow
                    key={entry.id}
                    entry={entry}
                    orderBy={orderBy}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
