import Link from "next/link";
import { CompetitionDetailsForm } from "@/components/portal/admin/competition/CompetitionDetailsForm";
import { CompetitionEntriesSection } from "@/components/portal/admin/competition/CompetitionEntriesSection";
import {
  fetchAdminCompetition,
  fetchAdminCompetitionEntries,
  sortEntriesForAdmin,
} from "@/lib/liveCompetition/adminData";

export default async function AdminCompetitionPage() {
  const competition = await fetchAdminCompetition();

  if (!competition) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/portal/admin"
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            ← Partner review
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
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/portal/admin"
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            ← Partner review
          </Link>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
            Admin · Event
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Live competition
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            Update the in-app banner and leaderboard during the event. Changes go
            live on the public API within about 30 seconds.
          </p>
        </div>

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
      </div>

      <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Competition details</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Copy, theme, and which app environments show the banner.
        </p>
        <div className="mt-6">
          <CompetitionDetailsForm competition={competition} />
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
        <CompetitionEntriesSection entries={entries} metricType={competition.metricType} />
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-xs text-neutral-500">
        <p className="font-semibold text-neutral-400">API preview</p>
        <ul className="mt-2 space-y-1">
          <li>
            <code>/api/live-competition?environment=test</code>
            {competition.activeInTest ? " → 200" : " → 404 when test is off"}
          </li>
          <li>
            <code>/api/live-competition?environment=production</code>
            {competition.activeInProduction ? " → 200" : " → 404 when production is off"}
          </li>
        </ul>
      </section>
    </div>
  );
}
