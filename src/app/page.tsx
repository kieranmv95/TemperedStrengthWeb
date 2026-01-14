"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribeUser } from "./actions";

export default function Home() {
  const [state, formAction, isPending] = useActionState(subscribeUser, null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background image - 50vh on mobile, 100vh on desktop, scrolls with content */}
      <div className="absolute top-0 left-0 right-0 h-[65vh] md:h-screen z-0">
        <Image
          src="/lifting.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Bottom fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Subtle grid background */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-center mb-16 animate-fade-in">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={180}
            height={50}
            priority
            className="opacity-90"
          />
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32 animate-fade-in-delay-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9b072]/30 bg-[#c9b072]/5 text-[#c9b072] text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#c9b072] animate-pulse" />
            COMING SOON TO iOS
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Gym programs that
            <span className="block text-[#c9b072]">actually work.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-loose">
            Free and Pro strength & Olympic lifting programs designed by
            experts. Smart features that adapt when life gets in the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="#waitlist-form"
              className="inline-flex items-center justify-center gap-2 bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] gold-glow"
            >
              Join the waitlist
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("waitlist-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
            >
              Get Updates
            </button>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 animate-fade-in-delay-2">
          {[
            { value: "6", label: "Programs Available" },
            { value: "4", label: "Free Programs" },
            { value: "2", label: "Disciplines" },
            { value: "40+", label: "On-demand workouts" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/50"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#c9b072]">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Programs Section */}
        <section id="programs" className="mb-32 scroll-mt-8">
          <div className="text-center animate-fade-in-delay-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Programs for Every Lifter
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              From free foundational programs to Pro periodized training.
              Launching with strength and Olympic disciplines, with more coming
              soon.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Smart Features
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Training tools that adapt to real life. Because the perfect
              workout is the one you can actually do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* On-Demand Workouts */}
            <div className="relative group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-[#c9b072]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 leading-snug">
                On-Demand Workouts
              </h3>
              <p className="text-neutral-400 leading-loose">
                Need to feel the burn but don&apos;t have time for a full
                program? Pick from our library of one-off workouts for quick,
                effective sessions. Pro unlocks the full library.
              </p>
              <div className="mt-4 inline-flex items-center text-[#c9b072] text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c9b072] mr-2" />
                Full library with Pro
              </div>
            </div>

            {/* The Brief */}
            <div className="relative group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-[#c9b072]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 leading-snug">
                The Brief
              </h3>
              <p className="text-neutral-400 leading-loose">
                Curated content to level up your knowledge. Fitness articles,
                Apple Music playlists for your sessions, and a glossary of gym
                terminology to decode common lingo.
              </p>
              <div className="mt-4 inline-flex items-center text-green-500 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Free for everyone
              </div>
            </div>

            {/* Smart Swapping */}
            <div className="relative group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-[#c9b072]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
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
              </div>
              <h3 className="text-xl font-semibold mb-3 leading-snug">
                Smart Exercise Swapping
              </h3>
              <p className="text-neutral-400 leading-loose">
                Equipment unavailable? Tap to swap any exercise for an
                alternative that targets the same muscle groups with different
                kit.
              </p>
              <div className="mt-4 inline-flex items-center text-[#c9b072] text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c9b072] mr-2" />
                Unlimited swaps with Pro
              </div>
            </div>

            {/* Growing Library */}
            <div className="relative group p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-[#c9b072]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 leading-snug">
                Constantly Evolving
              </h3>
              <p className="text-neutral-400 leading-loose">
                New programs added regularly. We&apos;re building toward
                hundreds of programs covering every training style and goal.
              </p>
              <div className="mt-4 inline-flex items-center text-neutral-500 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c9b072] mr-2 animate-pulse" />
                Expanding Monthly
              </div>
            </div>
          </div>
        </section>

        {/* Free vs Pro */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Free & Pro
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Start free, upgrade when you&apos;re ready. Most of our programs
              are completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border border-neutral-700 bg-neutral-900/30">
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                Free
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Started</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Multiple complete training programs",
                  "On-demand workouts (limited)",
                  "The Brief: articles, playlists & glossary",
                  "10 Smart exercise swaps per month",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-3xl font-bold">
                £0
                <span className="text-base font-normal text-neutral-500">
                  {" "}
                  / forever
                </span>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="relative p-8 rounded-2xl border border-[#c9b072]/50 bg-gradient-to-b from-[#c9b072]/5 to-transparent overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#c9b072] text-black text-xs font-bold uppercase">
                Pro
              </div>
              <div className="text-sm font-medium text-[#c9b072] uppercase tracking-wider mb-2">
                Pro
              </div>
              <h3 className="text-2xl font-bold mb-4">Level Up</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "All PRO programs available",
                  "Full on-demand workouts library",
                  "Unlimited Smart exercise swaps",
                  "Exclusive content & features",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <svg
                      className="w-5 h-5 text-[#c9b072] flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-3xl font-bold text-[#c9b072]">
                Available at Launch
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section id="waitlist-form" className="relative mb-16 scroll-mt-8">
          <div className="relative p-8 md:p-12 rounded-2xl border border-[#c9b072]/30 bg-gradient-to-br from-[#c9b072]/5 via-transparent to-transparent overflow-hidden">
            <div className="absolute inset-0 shimmer pointer-events-none" />

            <div className="relative text-center space-y-6 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold">
                Join the waitlist
              </h2>
              <p className="text-neutral-400">
                Get notified when we launch the app, new programs, features, and
                exclusive content. No spam, just gains.
              </p>

              <form action={formAction} className="space-y-4 pt-2">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full border border-neutral-700 bg-neutral-900/80 text-white placeholder:text-neutral-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9b072]/50 focus:border-[#c9b072]/50 transition-all duration-200"
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-6 py-4 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isPending ? "Joining..." : "Join the List"}
                </button>

                {state?.message && (
                  <p
                    className={`text-sm font-medium px-4 py-3 rounded-lg ${
                      state.success
                        ? "text-green-400 bg-green-500/10 border border-green-500/20"
                        : "text-red-400 bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {state.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-neutral-600 pt-8 border-t border-neutral-800">
          <p>&copy; {new Date().getFullYear()} localhostdevelopment ltd</p>
        </footer>
      </div>
    </main>
  );
}
