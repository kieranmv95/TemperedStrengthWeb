"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./links.module.css";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Desktop cursor spotlight. Entrance motion is CSS, so this stays a thin island. */
export function LinksMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card || !root.contains(card)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    const sync = () => {
      root.removeEventListener("pointermove", onMove);
      if (fine.matches && !reduced.matches) {
        root.addEventListener("pointermove", onMove);
      }
    };

    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      root.removeEventListener("pointermove", onMove);
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={ref} className={styles.column}>
      {children}
    </div>
  );
}
