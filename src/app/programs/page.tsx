import type { Metadata } from "next";
import Link from "next/link";
import { programs, temperedDaily } from "@/data/programs";
import {
  freeRecoveryFlows,
  proRecoveryDetail,
  workoutEquipment,
  workoutFormats,
  workoutLibrary,
} from "@/data/library";
import { RECOVERY_FLOWS_COUNT } from "@/data/homeFeatures";
import { SiteHeader } from "../../components/SiteHeader";
import { StoreDownloadRow } from "@/components/store/StoreBadges";
import { INSTAGRAM_URL } from "@/lib/site";

const freeProgramCount = programs.filter((program) => program.tier === "Free").length;

export const metadata: Metadata = {
  title: "Programs | Tempered Strength",
  description: `${programs.length} training programmes, ${freeProgramCount} of them free. Bodybuilding, powerlifting, 5/3/1, Olympic lifting, HIIT, and kettlebell work, with the standalone workout library and ${RECOVERY_FLOWS_COUNT} recovery flows. Tempered Daily is coming soon.`,
};

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(255, 186, 111,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255, 186, 111,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-12" />

        <div className="text-center mb-14">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
            Training library
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Programs
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {programs.length} programmes, {freeProgramCount} of them free. You
            run one at a time. Sessions land on set days, with warm-ups, rest
            timers, and set logging, and you can move a session to another day.
            Onboarding recommends a programme from your interests and experience.
          </p>
        </div>

        <div className="space-y-5 mb-8">
          {programs.map((program) => (
            <article
              key={program.name}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-6 md:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white pr-4">
                  {program.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={
                      program.tier === "Pro"
                        ? "inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#FFBA6F]/50 text-[#FFBA6F] bg-[#FFBA6F]/5"
                        : "inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-green-500/35 text-green-500 bg-green-500/5"
                    }
                  >
                    {program.tier}
                  </span>
                  <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-neutral-700 text-neutral-300">
                    {program.level}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-5 pb-5 border-b border-neutral-800">
                <div>
                  <dt className="text-neutral-500 mb-0.5">Sessions / week</dt>
                  <dd className="text-neutral-200 font-medium">
                    {program.sessionsPerWeek}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 mb-0.5">Total run</dt>
                  <dd className="text-neutral-200 font-medium">
                    {program.totalRunTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 mb-0.5">Typical session</dt>
                  <dd className="text-neutral-200 font-medium">
                    {program.typicalSession}
                  </dd>
                </div>
              </dl>

              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                {program.description}
              </p>
            </article>
          ))}
        </div>

        <section className="mb-16" aria-labelledby="daily-heading">
          <article className="relative overflow-hidden rounded-2xl border-2 border-[#FFBA6F] bg-[#16120c] p-6 md:p-8 shadow-[0_0_60px_rgba(255,186,111,0.16)]">
            <div className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-[#FFBA6F]/20 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full bg-[#FFBA6F] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1108]">
                    Coming soon
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFCA91]">
                    Not in the app yet
                  </span>
                </div>
                <h2 id="daily-heading" className="text-2xl md:text-3xl font-bold text-white">
                  {temperedDaily.name}
                </h2>
              </div>
              <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#FFBA6F]/50 text-[#FFBA6F] bg-[#FFBA6F]/10">
                {temperedDaily.tier} when it launches
              </span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-5 pb-5 border-b border-[#FFBA6F]/20">
              <div>
                <dt className="text-neutral-500 mb-0.5">Sessions / week</dt>
                <dd className="text-neutral-200 font-medium">{temperedDaily.sessionsPerWeek}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-0.5">When it updates</dt>
                <dd className="text-neutral-200 font-medium">{temperedDaily.totalRunTime}</dd>
              </div>
              <div>
                <dt className="text-neutral-500 mb-0.5">Versions</dt>
                <dd className="text-neutral-200 font-medium">{temperedDaily.typicalSession}</dd>
              </div>
            </dl>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              {temperedDaily.description}
            </p>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-3">
              {temperedDaily.blocks}
            </p>
          </article>
        </section>

        <section className="mb-16" aria-labelledby="workouts-heading">
          <h2 id="workouts-heading" className="text-2xl md:text-3xl font-bold mb-3">
            Standalone workouts
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            One-off sessions you can favourite, filter, and log. Filters cover
            discipline, equipment, duration, favourites, and Pro. Tempered Daily
            is separate from this library. Skill sessions also unlock for coaches.
          </p>
          <div className="overflow-x-auto rounded-xl border border-neutral-800 mb-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-900/80 text-neutral-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Library</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Free</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Pro</th>
                </tr>
              </thead>
              <tbody>
                {workoutLibrary.map((row) => (
                  <tr key={row.name} className="border-t border-neutral-800">
                    <th scope="row" className="px-4 py-3 font-medium text-neutral-200">
                      {row.name}
                    </th>
                    <td className="px-4 py-3 text-right text-neutral-300 tabular-nums">
                      {row.free ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-300 tabular-nums">
                      {row.pro ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-neutral-500 text-sm mb-6">
            A dash means that side of the library is empty. Rainhill, Arena Games,
            and Girl Games are free. Skill sessions are Pro.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFBA6F] mb-3">
                Formats
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {workoutFormats.join(", ")}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFBA6F] mb-3">
                Equipment filters
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {workoutEquipment.join(", ")}, and more.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="recovery-heading">
          <h2 id="recovery-heading" className="text-2xl md:text-3xl font-bold mb-3">
            Recovery and mobility
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
            {RECOVERY_FLOWS_COUNT} guided flows. {freeRecoveryFlows.length} are
            free. Rest days inside a programme also suggest easy work — a walk,
            swim, cycle, zone 2, yoga, full rest, sauna, or meditation — plus a
            mobility carousel.
          </p>
          <ul className="flex flex-wrap gap-2 mb-4">
            {freeRecoveryFlows.map((flow) => (
              <li
                key={flow}
                className="px-3 py-1.5 rounded-full text-sm border border-green-500/35 text-green-400 bg-green-500/5"
              >
                {flow}
              </li>
            ))}
          </ul>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
            {proRecoveryDetail}
          </p>
        </section>

        <div className="mt-12 text-center space-y-4">
          <p className="text-neutral-500 text-sm">
            Train in the app with logging, swaps, and timers built in.
          </p>
          <div className="flex flex-col gap-6 justify-center items-center">
            <StoreDownloadRow />
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center flex-wrap w-full">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#FFBA6F]/50 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-[#FFBA6F]/5"
            >
              Back to Home
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#FFBA6F]/50 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-[#FFBA6F]/5"
            >
              <InstagramGlyph className="w-5 h-5" />
              Instagram
            </a>
            </div>
          </div>
        </div>

        <footer className="text-sm text-neutral-600 pt-8 mt-16 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Home
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Instagram
              </a>
              <Link
                href="/terms"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
