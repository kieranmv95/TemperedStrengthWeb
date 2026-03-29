import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL, INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roadmap | Tempered Strength",
  description:
    "See what's coming next for Tempered Strength. Our public roadmap for upcoming features, improvements, and content updates.",
};

interface RoadmapItem {
  title: string;
  description: string;
}

interface RoadmapCategory {
  name: string;
  icon: React.ReactNode;
  items: RoadmapItem[];
}

const categories: RoadmapCategory[] = [
  {
    name: "Training UX",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    items: [
      {
        title: "Amber lift state",
        description:
          "A new amber colour for sets where you completed your reps but had to break the set. Sits between the existing green/gold (success) and red (fail) states.",
      },
      {
        title: "Day description",
        description:
          "Each training day will have a top-level description outlining the session goals, target feel, and intent. Could eventually expand into video-based day briefings.",
      },
      {
        title: "Restart timer quick-button",
        description:
          "A dedicated button to quickly restart the rest timer without navigating away from the current view.",
      },
      {
        title: "Larger CTAs for timer and sets",
        description:
          "Bigger tap targets on the timer and set completion buttons for easier mid-workout interaction.",
      },
    ],
  },
  {
    name: "Exercise Intelligence",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    items: [
      {
        title: "Improved exercise swapping logic",
        description:
          "Current swap matches movement pattern but can return a different muscle group. Will filter by both movement pattern AND muscle group — may require expanding the exercise database.",
      },
      {
        title: "Exercise descriptions with fallback",
        description:
          "All exercises will have a generic fallback description. If a bespoke description doesn't exist (e.g. on a swapped exercise), it defaults to a generic one rather than showing nothing.",
      },
      {
        title: "Russian Twists rep clarification",
        description:
          "Confirm whether Russian Twists count left + right as one rep or separately, then implement correctly in the exercise description.",
      },
    ],
  },
  {
    name: "Content",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    items: [
      {
        title: "Video / demonstration content",
        description:
          "Simple, audio-free demo videos for exercises so users have visual guidance on correct form.",
      },
      {
        title: "Exercise database gaps",
        description:
          "Add missing exercises including sit-ups, and replace ab wheel rollouts with a more accessible alternative.",
      },
    ],
  },
  {
    name: "Stats & Tracking",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    items: [
      {
        title: "Program stats bar",
        description:
          "A stats/completion block at the top of each program showing total weight lifted, sessions completed, and season completion percentage.",
      },
      {
        title: "Per-set RPE",
        description:
          "Record RPE for each individual set. The overall session RPE will be calculated as the average of all exercise RPEs.",
      },
    ],
  },
  {
    name: "Education",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    items: [
      {
        title: "RPE education",
        description:
          "Better in-app guidance on what each season's RPE target means, helping users understand training intensity and how to self-regulate effort.",
      },
    ],
  },
  {
    name: "Notifications",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    items: [
      {
        title: "Rest timer notifications",
        description:
          "A push notification fires when your rest period is complete. If you tap back into the app before it fires, the notification is automatically dismissed.",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-center mb-12">
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

        {/* Page Title */}
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
            What&apos;s coming next
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Roadmap
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
            A look at what we&apos;re building next. Features are subject to
            change as we learn from your feedback.
          </p>
        </div>

        {/* Version Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c9b072]/40 bg-[#c9b072]/5">
            <span className="w-2 h-2 rounded-full bg-[#c9b072] animate-pulse" />
            <span className="text-sm font-semibold text-[#c9b072] tracking-wide">
              v1.5
            </span>
            <span className="text-sm text-neutral-400">— Next Release</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center text-[#c9b072]">
                  {category.icon}
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {category.name}
                </h2>
              </div>

              <div className="space-y-3 pl-[3px]">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="relative pl-8 border-l border-neutral-800"
                  >
                    <div className="absolute left-[-5px] top-[10px] w-[9px] h-[9px] rounded-full border-2 border-[#c9b072] bg-[#0a0a0a]" />
                    <div className="pb-6">
                      <h3 className="font-medium text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-neutral-500 text-sm">
            Have a feature request? We&apos;d love to hear it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>
        </div>

        {/* Footer */}
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
