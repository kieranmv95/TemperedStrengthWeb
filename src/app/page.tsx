"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribeUser } from "./actions";

export default function Home() {
  const [state, formAction, isPending] = useActionState(subscribeUser, null);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={180}
            height={54}
            priority
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Coming soon
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            We&apos;re tempering something special. Check back soon to see what
            we&apos;ve been building.
          </p>
          <form action={formAction} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full border p-2 rounded bg-zinc-800 text-white placeholder:text-zinc-400"
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300"
            >
              {isPending ? "Joining..." : "Notify Me"}
            </button>

            {state?.message && (
              <p className={state.success ? "text-green-600" : "text-red-600"}>
                {state.message}
              </p>
            )}
          </form>
        </div>

        <div className="space-y-3 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} localhostdevelopment ltd</p>
        </div>
      </div>
    </main>
  );
}
