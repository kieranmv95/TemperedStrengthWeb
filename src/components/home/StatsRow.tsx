"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./StatsRow.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const COUNT_MS = 1200;
const STAGGER = 60;

export type Stat = { value: string; label: string };

function split(value: string) {
  const match = /^(\d+)(.*)$/.exec(value);
  return match ? { target: Number(match[1]), suffix: match[2] } : null;
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia(REDUCED_MOTION).matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const counters = [...grid.querySelectorAll<HTMLElement>("[data-count]")].map((el) => ({
      el,
      parts: split(el.dataset.count ?? ""),
    }));
    counters.forEach(({ el, parts }) => {
      if (parts) el.textContent = `0${parts.suffix}`;
    });

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();

        const tick = (now: number) => {
          let running = false;
          counters.forEach(({ el, parts }, i) => {
            if (!parts) return;
            const t = Math.min(1, Math.max(0, (now - start - i * STAGGER) / COUNT_MS));
            el.textContent = `${Math.round(parts.target * easeOut(t))}${parts.suffix}`;
            if (t < 1) running = true;
          });
          frame = running ? requestAnimationFrame(tick) : 0;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(grid);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      counters.forEach(({ el }) => {
        el.textContent = el.dataset.count ?? "";
      });
    };
  }, []);

  return (
    <Reveal className="mb-20 md:mb-28">
      <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-reveal-item
            className={`${styles.card} text-center p-5 md:p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm h-full`}
          >
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFBA6F]">
              <span className={styles.value}>
                <span className="invisible" aria-hidden>
                  {stat.value}
                </span>
                <span className={styles.counter} data-count={stat.value} aria-hidden>
                  {stat.value}
                </span>
                <span className="sr-only">{stat.value}</span>
              </span>
            </div>
            <div className="text-xs md:text-sm text-neutral-500 mt-1 leading-snug">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
