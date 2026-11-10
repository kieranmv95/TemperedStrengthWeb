"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section";
  /** Gap between `[data-reveal-item]` children, in ms. */
  stagger?: number;
};

/**
 * Fades its `[data-reveal-item]` descendants up once, staggered in DOM order,
 * the first time the block scrolls into view. Styles live in globals.css.
 */
export function Reveal({ as = "div", stagger = 60, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${i * stagger}ms`);
    });

    const reveal = () => {
      root.dataset.revealed = "";
    };

    if (window.matchMedia(REDUCED_MOTION).matches || typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [stagger]);

  if (as === "section") {
    return (
      <section ref={(node) => { ref.current = node; }} data-reveal-root {...rest}>
        {children}
      </section>
    );
  }

  return (
    <div ref={(node) => { ref.current = node; }} data-reveal-root {...rest}>
      {children}
    </div>
  );
}
