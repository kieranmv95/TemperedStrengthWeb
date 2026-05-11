import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/data/programs";
import { SiteHeader } from "../../components/SiteHeader";
import { APP_STORE_URL, INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs | Tempered Strength",
  description:
    "Nine structured gym programs — five free, four Pro — from bodybuilding and powerbuilding to powerlifting and Olympic lifting. Session length, duration, and tier at a glance.",
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
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-12" />

        <div className="text-center mb-14">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
            Training library
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Programs
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {programs.length} complete programs in the app, from
            hypertrophy and powerbuilding to SBD peaking, Olympic lifting and more.
          </p>
        </div>

        <div className="space-y-5 mb-20">
          {programs.map((program) => (
            <article
              key={program.name}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-6 md:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white pr-4">
                  {program.name}
                </h2>
                <span
                  className={
                    program.tier === "Pro"
                      ? "inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#c9b072]/50 text-[#c9b072] bg-[#c9b072]/5"
                      : "inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-green-500/35 text-green-500 bg-green-500/5"
                  }
                >
                  {program.tier}
                </span>
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

        <div className="mt-12 text-center space-y-4">
          <p className="text-neutral-500 text-sm">
            Train in the app with logging, swaps, and timers built in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center flex-wrap">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Download on the App Store
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
            >
              Back to Home
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
            >
              <InstagramGlyph className="w-5 h-5" />
              Instagram
            </a>
          </div>
        </div>

        <footer className="text-sm text-neutral-600 pt-8 mt-16 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/"
                className="hover:text-[#c9b072] transition-colors"
              >
                Home
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c9b072] transition-colors"
              >
                Instagram
              </a>
              <Link
                href="/terms"
                className="hover:text-[#c9b072] transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#c9b072] transition-colors"
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
