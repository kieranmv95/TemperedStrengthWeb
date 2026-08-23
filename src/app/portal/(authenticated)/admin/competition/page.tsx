import Link from "next/link";
import { CompetitionDetailsForm } from "@/components/portal/admin/competition/CompetitionDetailsForm";
import { CompetitionEntriesSection } from "@/components/portal/admin/competition/CompetitionEntriesSection";
import {
  isPortalAdmin,
  requirePortalAdminAreaAccess,
} from "@/lib/portal/adminAccess";
import {
  fetchAdminCompetition,
  fetchAdminCompetitionEntries,
  sortEntriesForAdmin,
} from "@/lib/liveCompetition/adminData";

export default async function AdminCompetitionPage() {
  const { profile } = await requirePortalAdminAreaAccess();
  const canEditCompetition = isPortalAdmin(profile);
  const competition = await fetchAdminCompetition();

  if (!competition) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/portal/admin"
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            {canEditCompetition ? "← Partner review" : "← Admin"}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Live competition
          </h1>
        </div>

        <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 px-4 py-4 text-sm text-amber-100">
          <p className="font-semibold">No competition row found</p>
          <p className="mt-2 text-amber-100/90">
            The <code className="text-xs">active_competition</code> table needs a
            singleton row with <code className="text-xs">id = 1</code>. Run your
            competition seed migration in Supabase, then reload this page.
          </p>
        </div>
      </div>
    );
  }

  const entries = sortEntriesForAdmin(
    await fetchAdminCompetitionEntries(),
    competition.metricType
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/portal/admin"
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            {canEditCompetition ? "← Partner review" : "← Admin"}
          </Link>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
            Admin · Event
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {canEditCompetition ? "Live competition" : "Leaderboard entries"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            {canEditCompetition
              ? "Update the in-app banner and leaderboard during the event. Changes go live on the public API within about 30 seconds."
              : "Add scores as they come in. Changes go live in the app within about 30 seconds."}
          </p>
        </div>

        {canEditCompetition ? (
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-full border px-2.5 py-1 font-semibold ${
                competition.activeInTest
                  ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-200"
                  : "border-neutral-800 bg-neutral-900/60 text-neutral-500"
              }`}
            >
              Test {competition.activeInTest ? "live" : "off"}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 font-semibold ${
                competition.activeInProduction
                  ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-200"
                  : "border-neutral-800 bg-neutral-900/60 text-neutral-500"
              }`}
            >
              Production {competition.activeInProduction ? "live" : "off"}
            </span>
          </div>
        ) : null}
      </div>

      {canEditCompetition ? (
        <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white">
                  Competition details
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Copy, theme, and which app environments show the banner.
                </p>
              </div>
              <span
                className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 transition-transform group-open:rotate-180"
                aria-hidden
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
            <div className="mt-6 border-t border-neutral-800/80 pt-6">
              <CompetitionDetailsForm competition={competition} />
            </div>
          </details>
        </section>
      ) : null}

      <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
        <CompetitionEntriesSection
          entries={entries}
          metricType={competition.metricType}
        />
      </section>

      {canEditCompetition ? (
        <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-400">API preview</p>
          <ul className="mt-2 space-y-1">
            <li>
              <code>/api/live-competition?environment=test</code>
              {competition.activeInTest ? " → 200" : " → 404 when test is off"}
            </li>
            <li>
              <code>/api/live-competition?environment=production</code>
              {competition.activeInProduction
                ? " → 200"
                : " → 404 when production is off"}
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  );
}
