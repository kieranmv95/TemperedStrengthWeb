"use client";

import { useState, type FormEvent } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; alreadySubscribed: boolean }
  | { status: "error"; message: string };

export function NewsletterSignup({
  className = "",
  heading = "Stay in the loop",
  description = "Get updates and training tips. No spam.",
}: {
  className?: string;
  heading?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as {
        error?: string;
        ok?: boolean;
        alreadySubscribed?: boolean;
      };

      if (!res.ok) {
        setState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setState({
        status: "success",
        alreadySubscribed: Boolean(data.alreadySubscribed),
      });
      setEmail("");
    } catch {
      setState({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm p-6 md:p-8 ${className}`}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-2">{heading}</h2>
      <p className="text-neutral-400 text-sm md:text-base mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state.status === "error" || state.status === "success") {
              setState({ status: "idle" });
            }
          }}
          disabled={state.status === "loading"}
          className="flex-1 min-w-0 rounded-lg border border-neutral-700 bg-black/40 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-[#c9b072]/60 focus:outline-none focus:ring-2 focus:ring-[#c9b072]/25 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#d4c08a] disabled:opacity-60 sm:shrink-0"
        >
          {state.status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </form>

      {state.status === "success" && (
        <p className="mt-4 text-sm text-green-500" role="status">
          {state.alreadySubscribed
            ? "You’re already subscribed. Thanks for being here."
            : "Thanks — check your inbox for a welcome message."}
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}
    </div>
  );
}
