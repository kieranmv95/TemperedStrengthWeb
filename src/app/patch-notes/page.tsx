import { getPatchNotesVersions } from "@/lib/patchNotes";
import { SiteHeader } from "../../components/SiteHeader";
import Link from "next/link";

export const metadata = {
  title: "Patch Notes | Tempered Strength",
  description:
    "See what’s new in Tempered Strength — release notes and detailed patch notes by version.",
};

export default async function PatchNotesIndexPage() {
  const versions = await getPatchNotesVersions();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-10" />

        <div className="text-center mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
            Changelog
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Patch Notes
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Detailed release notes for each version of Tempered Strength.
          </p>
        </div>

        {versions.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-8 text-center">
            <p className="text-neutral-300 font-semibold mb-2">
              No patch notes yet
            </p>
            <p className="text-neutral-500 text-sm">
              Add markdown files to <code className="font-mono">src/patch-notes</code>{" "}
              to publish release notes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {versions.map((version) => (
              <Link
                key={version}
                href={`/patch-notes/${encodeURIComponent(version)}`}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 backdrop-blur-sm overflow-hidden transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                        Version
                      </p>
                      <h2 className="text-2xl font-bold leading-tight">
                        {version}
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9b072] group-hover:text-[#d4c08a] transition-colors shrink-0">
                      Read
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 text-sm text-neutral-500">
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#c9b072]/25 bg-[#c9b072]/5 text-[#c9b072]">
                      Update {version}
                    </span>
                    <span className="font-mono text-xs text-neutral-600">
                      /patch-notes/{version}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

