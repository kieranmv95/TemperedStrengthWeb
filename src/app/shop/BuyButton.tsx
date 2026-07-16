"use client";

import { useState } from "react";

type BuyButtonProps = {
  variantId: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export default function BuyButton({
  variantId,
  disabled = false,
  className = "",
  fullWidth = false,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    if (!variantId || disabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading || disabled || !variantId}
        className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c9b072] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d8c28b] disabled:cursor-not-allowed disabled:opacity-70 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {loading ? "Loading..." : disabled || !variantId ? "Select options" : "Buy Now"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
