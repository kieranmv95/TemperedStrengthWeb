"use client";

import { useState, type CSSProperties } from "react";
import conic from "@/components/motion/ConicBorder.module.css";
import { Reveal } from "@/components/motion/Reveal";
import { freeTierFeatures, proTierFeatures } from "@/data/homeFeatures";
import { INSTAGRAM_URL } from "@/lib/site";
import styles from "./Pricing.module.css";

type Period = "monthly" | "yearly";

const PRO_PRICES: Record<Period, { amount: string; unit: string; note: string }> = {
  monthly: { amount: "£4.99", unit: "/ month", note: "Billed monthly" },
  yearly: { amount: "£49.99", unit: "/ year", note: "Billed yearly · saves £9.89 on monthly" },
};

function Tick({ className, index }: { className: string; index: number }) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      style={{ "--tick-i": index } as CSSProperties}
      aria-hidden
    >
      <path
        className={styles.tick}
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}

export function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");
  const price = PRO_PRICES[period];

  return (
    <Reveal as="section" className="mb-20 md:mb-28" aria-labelledby="pricing-heading">
      <div className="text-center mb-12 md:mb-14">
        <p
          data-reveal-item
          className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4"
        >
          Start free
        </p>
        <h2
          id="pricing-heading"
          data-reveal-item
          className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
        >
          Free &amp; Pro
        </h2>
        <p data-reveal-item className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Free means anyone can use it. Pro is a subscription, or a promo
          code. A few features are in both, with a tighter limit on Free.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div
          data-reveal-item
          className="p-8 rounded-2xl border border-neutral-700 bg-neutral-900/30 backdrop-blur-sm h-full"
        >
          <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
            Free
          </div>
          <h3 className="text-2xl font-bold mb-4">Get Started</h3>
          <ul className="space-y-3 mb-8">
            {freeTierFeatures.map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-neutral-300">
                <Tick className="text-green-500" index={i} />
                {item}
              </li>
            ))}
          </ul>
          <div className="text-3xl font-bold">
            £0
            <span className="text-base font-normal text-neutral-500"> / forever</span>
          </div>
        </div>

        <div data-reveal-item className="h-full">
          <div className={styles.proShell}>
            <div className={conic.border} aria-hidden="true" />
            <div className={`${styles.proCard} p-8`}>
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#FFBA6F] text-[#1A1108] text-xs font-bold uppercase">
                Pro
              </div>
              <div className="text-sm font-medium text-[#FFBA6F] uppercase tracking-wider mb-2">
                Pro
              </div>
              <h3 className="text-2xl font-bold mb-4">Level Up</h3>
              <ul className="space-y-3 mb-8">
                {proTierFeatures.map((item, i) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-300">
                    <Tick className="text-[#FFBA6F]" index={i} />
                    {item}
                  </li>
                ))}
              </ul>

              <div
                role="group"
                aria-label="Billing period"
                data-period={period}
                className={`${styles.toggle} mb-4`}
              >
                <span className={styles.thumb} aria-hidden />
                {(["monthly", "yearly"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={period === option}
                    className={styles.option}
                    onClick={() => setPeriod(option)}
                  >
                    {option === "monthly" ? "Monthly" : "Yearly"}
                  </button>
                ))}
              </div>

              <div className={styles.priceWindow} aria-live="polite">
                <span key={period} className={`${styles.price} text-3xl font-bold text-[#FFBA6F]`}>
                  {price.amount}
                  <span className="text-base font-normal text-neutral-400"> {price.unit}</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500">{price.note}</p>
            </div>
          </div>
        </div>
      </div>

      <p
        data-reveal-item
        className="mt-8 max-w-3xl mx-auto text-center text-sm text-neutral-400 leading-relaxed"
      >
        Coach access is separate from Pro. Coaches, PTs, and gym owners can
        message{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFBA6F] hover:underline"
        >
          @temperedstrength
        </a>{" "}
        on Instagram for a free coach upgrade. That unlocks skill workouts,
        Skills and Cues, and every mobility flow. It does not replace Pro
        for programmes or the rest of the Pro library, including Tempered
        Daily when that launches.
      </p>
    </Reveal>
  );
}
