"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribeUser } from "./actions";

export default function Home() {
  const [state, formAction, isPending] = useActionState(subscribeUser, null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Logo */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={200}
            height={60}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        {/* The Hook: Core Narrative */}
        <section className="text-center space-y-6 mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
            Stop following spreadsheets. Start training smarter.
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 font-medium mx-auto leading-relaxed max-w-3xl">
            The first workout platform that doesn&apos;t just track your
            progress, it adapts to your life in real-time. Whether you have 20
            minutes or 2 hours, a full garage or a single dumbbell, Tempered
            Strength builds the perfect session for the athlete you are today.
          </p>
          <div className="pt-6">
            <button
              onClick={() => {
                document
                  .getElementById("waitlist-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-2xl transition-all duration-200 text-base transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the Waitlist
            </button>
          </div>
        </section>

        {/* The "Why": Three Key Pillars */}
        <section className="space-y-12 mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 relative">
            <span className="relative inline-block">
              Why This Changes Everything
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
            </span>
          </h2>

          <div className="space-y-16">
            {/* Pillar 1: The Real-Time Pivot */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
              <div className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 space-y-5 hover:border-blue-500/30 transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    The Real-Time Pivot
                  </span>
                </h3>
                <div className="space-y-4 text-center max-w-3xl mx-auto">
                  <p className="text-zinc-400 text-base md:text-lg">
                    <span className="font-semibold text-red-400">
                      The Problem:
                    </span>{" "}
                    The gym is busy, you&apos;re short on time, or the equipment
                    you need is broken. Most apps break when your plan does.
                  </p>
                  <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">
                    <span className="font-semibold text-blue-400">
                      The Solution:
                    </span>{" "}
                    Never skip a set again. If the squat rack is busy or your
                    meeting ran late, your coach has a Plan B. Our Pivot Engine
                    instantly swaps exercises and recalibrates your session
                    without losing the stimulus your body needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2: Coaches with Soul */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
              <div className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 space-y-5 hover:border-purple-500/30 transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Coaches with Soul
                  </span>
                </h3>
                <div className="space-y-4 text-center max-w-3xl mx-auto">
                  <p className="text-zinc-400 text-base md:text-lg">
                    <span className="font-semibold text-red-400">
                      The Problem:
                    </span>{" "}
                    Generic apps feel like data entry. Real trainers offer
                    motivation and nuance.
                  </p>
                  <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">
                    <span className="font-semibold text-purple-400">
                      The Solution:
                    </span>{" "}
                    Choose your coach, not just your plan. From the data-driven
                    &quot;Scientist&quot; to the high-energy
                    &quot;Commander,&quot; your coach learns your limits. They
                    know when to push you for that extra 2.5kg and when to tell
                    you to dial it back and focus on form.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3: Fully Bespoke, Data-Driven Evolution */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
              <div className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 space-y-5 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Fully Bespoke, Data-Driven Evolution
                  </span>
                </h3>
                <div className="space-y-4 text-center max-w-3xl mx-auto">
                  <p className="text-zinc-400 text-base md:text-lg">
                    <span className="font-semibold text-red-400">
                      The Problem:
                    </span>{" "}
                    Standard &quot;Beginner&quot; plans are too easy;
                    &quot;Advanced&quot; plans are too rigid.
                  </p>
                  <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">
                    <span className="font-semibold text-cyan-400">
                      The Solution:
                    </span>{" "}
                    Programs that grow with you. Your training system builds
                    your entire training block from a deep dive into your goals,
                    injuries, and kit. Every set you log is a data point that
                    reshapes tomorrow&apos;s workout for 100% optimized volume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Feature List: The "How It Works" */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 relative">
            <span className="relative inline-block">
              How It Works
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></span>
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group relative border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-sm rounded-xl p-6 space-y-3 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h4 className="text-xl font-bold text-white relative z-10">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Intelligent Swapping
                </span>
              </h4>
              <p className="text-zinc-300 leading-relaxed relative z-10">
                Tap any exercise to find an instant, biomechanically-matched
                alternative based on the kit you have. Your coach has a Plan B
                for every movement.
              </p>
            </div>

            <div className="group relative border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-sm rounded-xl p-6 space-y-3 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h4 className="text-xl font-bold text-white relative z-10">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Weight Memory
                </span>
              </h4>
              <p className="text-zinc-300 leading-relaxed relative z-10">
                We remember every plate you&apos;ve ever moved so you never have
                to guess your starting point. Your history shapes your future.
              </p>
            </div>

            <div className="group relative border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-sm rounded-xl p-6 space-y-3 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h4 className="text-xl font-bold text-white relative z-10">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Adaptive RPE Coaching
                </span>
              </h4>
              <p className="text-zinc-300 leading-relaxed relative z-10">
                Tell your coach how the set felt, and watch your rest times and
                target weights adjust instantly. Real-time feedback, real-time
                adaptation.
              </p>
            </div>

            <div className="group relative border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-sm rounded-xl p-6 space-y-3 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h4 className="text-xl font-bold text-white relative z-10">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Time-Crunch Mode
                </span>
              </h4>
              <p className="text-zinc-300 leading-relaxed relative z-10">
                Sliding scale workouts. Tell the app you have 30 minutes, and it
                automatically prioritizes the heavy hitters to keep you on
                track.
              </p>
            </div>

            <div className="group relative border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-sm rounded-xl p-6 space-y-3 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 md:col-span-2 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h4 className="text-xl font-bold text-white relative z-10">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Vetted Exercise Vault
                </span>
              </h4>
              <p className="text-zinc-300 leading-relaxed relative z-10">
                A curated, professional-grade database of movements, quality
                control you can actually trust. Every exercise is vetted for
                safety and effectiveness.
              </p>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section
          id="waitlist-form"
          className="relative border-t border-zinc-800 pt-16 pb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent -z-10"></div>
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Get Early Access to the Future of Training
                </span>
              </h2>
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
                We&apos;re building a smarter way to train. Join the waitlist to
                be the first to experience the Pivot Engine and claim your
                founding member coach persona.
              </p>
            </div>

            <form action={formAction} className="space-y-5 pt-6">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm text-white placeholder:text-zinc-500 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-base hover:border-zinc-600"
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-2xl disabled:from-zinc-600 disabled:via-zinc-600 disabled:to-zinc-700 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 text-base transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? "Joining..." : "Join the Inner Circle"}
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
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500 pt-12 mt-12 border-t border-zinc-800">
          <p>&copy; {new Date().getFullYear()} localhostdevelopment ltd</p>
        </div>
      </div>
    </main>
  );
}
