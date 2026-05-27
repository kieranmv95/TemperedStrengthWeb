import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AppStoreBadgeIcon,
  GooglePlayBadgeIcon,
} from "@/components/store/StoreBadges";
import { APP_STORE_URL, INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Links | Tempered Strength",
  description:
    "Quick links to the Tempered Strength app, social channels, and legal documents.",
};

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9b072]/90 mb-3"
    >
      {children}
    </h2>
  );
}

function linkRowClassName() {
  return "group flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm px-4 py-3.5 md:px-5 md:py-4 transition-colors hover:border-[#c9b072]/35 hover:bg-[#c9b072]/[0.04]";
}

function googlePlayLinkRowClassName() {
  return "flex items-center gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 backdrop-blur-sm px-4 py-3.5 md:px-5 md:py-4 opacity-55 cursor-not-allowed";
}

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 md:py-12">
        <header className="flex justify-center mb-10">
          <Link href="/">
            <Image
              src="/logo_stacked.svg"
              alt="Tempered Strength"
              width={140}
              height={40}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
        </header>

        <div className="text-center mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-3">
            Everything in one place
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Links</h1>
          <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
            Download the app and find us online.
          </p>
        </div>

        <div className="space-y-8">
          <section aria-labelledby="social-heading">
            <SectionTitle id="social-heading">Apps</SectionTitle>
            <ul className="space-y-2">
              <li>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkRowClassName()}
                >
                  <AppStoreBadgeIcon />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Tempered Strength on the App Store</span>
                    <span className="text-xs text-neutral-500">iOS — strength and Olympic lifting programs with logging, swaps, and timers.</span>
                  </span>
                  <ExternalArrow className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-[#c9b072]" />
                </a>
              </li>
              <li>
                <div
                  className={googlePlayLinkRowClassName()}
                  aria-disabled="true"
                  title="Google Play — coming soon"
                >
                  <GooglePlayBadgeIcon className="opacity-45 grayscale" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Tempered Strength on Google Play</span>
                    <span className="text-xs text-neutral-500">Android — same programs and training tools.</span>
                  </span>
                  <span className="shrink-0 rounded-full border border-[#c9b072]/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c9b072]">
                    Coming soon
                  </span>
                </div>
              </li>
            </ul>
          </section>
          <section aria-labelledby="social-heading">
            <SectionTitle id="social-heading">The rest</SectionTitle>
            <ul className="space-y-2">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkRowClassName()}>
                  <InstagramGlyph className="w-6 h-6 shrink-0 text-white" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Tempered Strength on Instagram</span>
                    <span className="text-xs text-neutral-500 truncate">@temperedstrength</span>
                  </span>
                  <ExternalArrow className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-[#c9b072]" />
                </a>
              </li>
              <li>
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={linkRowClassName()}>
                  <YouTubeGlyph className="w-6 h-6 shrink-0 text-white" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Tempered Strength on YouTube</span>
                    <span className="text-xs text-neutral-500 truncate">@TemperedStrength</span>
                  </span>
                  <ExternalArrow className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-[#c9b072]" />
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="legal-heading">
            <SectionTitle id="legal-heading">THE BORING STUFF</SectionTitle>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className={linkRowClassName()}>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Terms &amp; Conditions</span>
                  </span>
                  <ChevronRight className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-[#c9b072]" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={linkRowClassName()}>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="font-semibold text-white">Privacy Policy</span>
                  </span>
                  <ChevronRight className="w-5 h-5 shrink-0 text-neutral-500 group-hover:text-[#c9b072]" />
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <footer className="text-sm text-neutral-600 pt-10 mt-12 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="hover:text-[#c9b072] transition-colors">
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
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c9b072] transition-colors"
              >
                YouTube
              </a>
              <Link href="/terms" className="hover:text-[#c9b072] transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#c9b072] transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
