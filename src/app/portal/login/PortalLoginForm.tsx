"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  portalAuthErrorMessage,
  safePortalNext,
} from "@/lib/portal/authRedirect";

export default function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safePortalNext(searchParams.get("next"));
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === "auth"
      ? portalAuthErrorMessage(searchParams.get("message"))
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/portal/auth/callback?next=${encodeURIComponent(next)}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSent(true);
    setCode("");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setError(null);

    const supabase = createClient();
    const token = code.replace(/\D/g, "");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: "email",
    });

    if (verifyError) {
      setVerifying(false);
      setError(
        verifyError.message.toLowerCase().includes("expired")
          ? "That code has expired. Request a new sign-in email."
          : "That code is invalid. Check the email and try again."
      );
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
      <div className="mx-auto w-full min-w-0 max-w-md">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9b072]">
          Partner portal
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter your email and we&apos;ll send you a sign-in link and a code. No
          password needed.
        </p>

        {sent ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
              Check your email for a sign-in link. You can also enter the 6-digit
              code below — that works even if the link doesn&apos;t.
            </div>

            {error ? (
              <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Email code
                </span>
                <input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  minLength={6}
                  maxLength={8}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white tracking-[0.3em] placeholder:tracking-normal placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={verifying || code.replace(/\D/g, "").length < 6}
                className="w-full rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
              >
                {verifying ? "Signing in…" : "Sign in with code"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
                setCode("");
              }}
              className="w-full text-center text-sm text-[#c9b072] hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error ? (
              <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
            >
              {loading ? "Sending…" : "Send sign-in email"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="text-[#c9b072] hover:underline">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
