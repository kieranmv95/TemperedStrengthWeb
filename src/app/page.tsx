"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribeUser } from "./actions";

export default function Home() {
  const [state, formAction, isPending] = useActionState(subscribeUser, null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center space-y-10">
        <div className="flex justify-center animate-fade-in">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={200}
            height={60}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Coming Soon
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-md mx-auto leading-relaxed">
              We&apos;re tempering something special. Check back soon to see
              what we&apos;ve been building.
            </p>
          </div>

          <form action={formAction} className="space-y-5 pt-4">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm text-white placeholder:text-zinc-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-4 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:from-zinc-600 disabled:to-zinc-700 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 text-base transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? "Joining..." : "Notify Me"}
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

        <div className="space-y-3 text-xs text-zinc-500 pt-8">
          <p>&copy; {new Date().getFullYear()} localhostdevelopment ltd</p>
        </div>
      </div>
    </main>
  );
}
