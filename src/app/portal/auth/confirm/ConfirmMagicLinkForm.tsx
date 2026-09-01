"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PortalEmailOtpType } from "@/lib/portal/authRedirect";

type Props = {
  tokenHash: string;
  type: PortalEmailOtpType;
  next: string;
};

export default function ConfirmMagicLinkForm({ tokenHash, type, next }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (verifyError) {
      setLoading(false);
      setError(
        verifyError.message.toLowerCase().includes("expired")
          ? "That sign-in link has expired. Request a new one."
          : "Sign-in link expired or invalid. Please try again."
      );
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#c9b072] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
      >
        {loading ? "Signing in…" : "Continue to Partner Portal"}
      </button>
    </form>
  );
}
