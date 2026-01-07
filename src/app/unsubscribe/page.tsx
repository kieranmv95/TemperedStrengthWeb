"use client";

import { Suspense, useActionState, useState } from "react";
import { unsubscribeAction } from "./actions";

function UnsubscribeForm() {
  const [email, setEmail] = useState<string>("");
  const [state, formAction, isPending] = useActionState(
    unsubscribeAction,
    null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Unsubscribe
          </h1>
          <p className="text-lg text-zinc-300 font-medium">
            Are you sure you want to stop receiving updates?
          </p>
        </div>

        <form action={formAction} className="space-y-5 pt-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm text-white placeholder:text-zinc-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-base"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-6 py-4 rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:from-zinc-600 disabled:to-zinc-700 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? "Unsubscribing..." : "Confirm Unsubscribe"}
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
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 flex items-center justify-center px-4">
          <p className="text-zinc-400">Loading...</p>
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}
