"use client";

import Image from "next/image";
import { memo, useEffect, useRef, type RefObject } from "react";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { Atmosphere } from "@/components/motion/Atmosphere";
import {
  homeFeatureMap,
  homeFeatureRows,
  type FeatureIcon,
  type HomeFeature,
} from "@/data/homeFeatures";
import styles from "./FeatureBento.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const COMPACT = "(max-width: 899px)";

const MAX_HOVER_TILT = 8;
const HOVER_SCALE = 1.03;
const TILT_EASE = 0.1;
const PARALLAX_RANGE = 20;
const PARALLAX_STRENGTHS = [1, 0.55, 0.8, 0.45, 0.7];

type Side = "left" | "right";

function FeatureIconGlyph({ icon }: { icon: FeatureIcon }) {
  const className = "w-5 h-5 text-[#FFBA6F]";

  switch (icon) {
    case "programs":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      );
    case "daily":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "workouts":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "mobility":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "swaps":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case "explore":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>
      );
  }
}

/** Reveals `[data-reveal]` children once, staggered in DOM order as they scroll in. */
function useRevealOnce(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = [...section.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reveal = (el: HTMLElement, delay: number) => {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      el.dataset.revealed = "";
    };

    if (
      window.matchMedia(REDUCED_MOTION).matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      targets.forEach((el) => reveal(el, 0));
      return;
    }

    const compact = window.matchMedia(COMPACT);
    let nextSlot = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        const stagger = compact.matches ? 50 : 100;
        const headingGap = compact.matches ? 120 : 200;

        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => targets.indexOf(a) - targets.indexOf(b))
          .forEach((el) => {
            const at = Math.max(now, nextSlot);
            reveal(el, Math.round(at - now));
            nextSlot = at + (el.dataset.reveal === "heading" ? headingGap : stagger);
            observer.unobserve(el);
          });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionRef]);
}

/** Phones drift slightly slower than their cards while the section is on screen. */
function useBentoParallax(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = [...section.querySelectorAll<HTMLElement>("[data-parallax]")].map(
      (el, i) => ({
        el,
        card: el.closest<HTMLElement>("[data-card]") ?? el,
        strength: PARALLAX_STRENGTHS[i % PARALLAX_STRENGTHS.length],
      })
    );

    const wide = window.matchMedia("(min-width: 900px)");
    const reduced = window.matchMedia(REDUCED_MOTION);
    let frame = 0;
    let listening = false;

    const enabled = () => wide.matches && !reduced.matches;

    const update = () => {
      frame = 0;
      if (!enabled()) {
        items.forEach(({ el }) => (el.style.transform = ""));
        return;
      }

      const half = window.innerHeight / 2;
      const rects = items.map(({ card }) => card.getBoundingClientRect());
      items.forEach(({ el, strength }, i) => {
        const rect = rects[i];
        const distance = half - (rect.top + rect.height / 2);
        const progress = Math.max(-1, Math.min(1, distance / (half + rect.height / 2)));
        el.style.transform = `translate3d(0, ${(progress * PARALLAX_RANGE * strength).toFixed(2)}px, 0)`;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const setListening = (next: boolean) => {
      if (next === listening) return;
      listening = next;
      if (next) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => setListening(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(section);
    wide.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);

    return () => {
      observer.disconnect();
      setListening(false);
      wide.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef]);
}

/** Cursor spotlight plus an eased tilt-and-scale on the phone, for mouse users only. */
function useCardHover(
  cardRef: RefObject<HTMLElement | null>,
  tiltRef: RefObject<HTMLElement | null>,
  shadowRef: RefObject<HTMLElement | null>,
  side: Side
) {
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const finePointer = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const compact = window.matchMedia(COMPACT);
    const dir = side === "right" ? -1 : 1;

    const target = { x: 0, y: 0, scale: 1 };
    const current = { x: 0, y: 0, scale: 1 };
    const pointer = { x: 0, y: 0, dirty: false };
    let hovering = false;
    let frame = 0;
    let lastTime = 0;

    const render = () => {
      const tilt = tiltRef.current;
      const shadow = shadowRef.current;
      if (!tilt || !shadow) return;
      const restX = compact.matches ? 2 : 4;
      const restY = dir * (compact.matches ? 4 : 8);
      const rx = restX + current.x;
      const ry = restY + current.y;
      tilt.style.transform = `perspective(1200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${current.scale.toFixed(4)})`;
      shadow.style.transform = `translate3d(${(-ry * 1.4).toFixed(2)}px, ${(10 + rx * 1.2).toFixed(2)}px, 0) scale(${current.scale.toFixed(4)})`;
    };

    const settle = () => {
      if (tiltRef.current) tiltRef.current.style.transform = "";
      if (shadowRef.current) shadowRef.current.style.transform = "";
      delete card.dataset.hovering;
      frame = 0;
      lastTime = 0;
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
      lastTime = time;
      const k = 1 - Math.pow(1 - TILT_EASE, dt / 16.7);

      if (pointer.dirty) {
        card.style.setProperty("--spot-x", `${pointer.x}px`);
        card.style.setProperty("--spot-y", `${pointer.y}px`);
        pointer.dirty = false;
      }

      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.scale += (target.scale - current.scale) * k;
      render();

      const resting =
        !hovering &&
        Math.abs(current.x) < 0.01 &&
        Math.abs(current.y) < 0.01 &&
        Math.abs(current.scale - 1) < 0.0005;

      if (resting) {
        current.x = 0;
        current.y = 0;
        current.scale = 1;
        settle();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!hovering) return;
      const rect = card.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      pointer.x = px;
      pointer.y = py;
      pointer.dirty = true;

      const nx = Math.max(-1, Math.min(1, (px / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, (py / rect.height) * 2 - 1));
      target.y = nx * MAX_HOVER_TILT;
      target.x = -ny * MAX_HOVER_TILT;
      start();
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || reduced.matches) return;
      hovering = true;
      card.dataset.hovering = "";
      target.scale = HOVER_SCALE;
      onMove(event);
    };

    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      target.x = 0;
      target.y = 0;
      target.scale = 1;
      start();
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cardRef, tiltRef, shadowRef, side]);
}

function FeatureCard({
  feature,
  side,
  className = "",
}: {
  feature: HomeFeature;
  side: Side;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  useCardHover(cardRef, tiltRef, shadowRef, side);

  const isWide = feature.span === "wide";
  const isHighlighted = feature.highlighted;
  const phoneWidth = isWide
    ? "w-[168px] sm:w-[188px] lg:w-[200px]"
    : "w-[156px] sm:w-[168px]";

  return (
    <div
      data-reveal="card"
      className={[styles.reveal, "flex w-full", className].filter(Boolean).join(" ")}
    >
      <div
        ref={cardRef}
        data-card
        className={`${styles.card} group relative flex flex-1 rounded-2xl border backdrop-blur-sm ${isHighlighted
          ? "border-[#FFBA6F]/40 bg-[#FFBA6F]/5"
          : "border-neutral-800 bg-neutral-900/50"
          } ${feature.mockup
            ? isWide
              ? "flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 p-6 md:p-7"
              : "flex-col gap-5 p-6 md:p-7"
            : "flex-col"}`}
      >
        <div className={styles.spotlight} aria-hidden />
        <div className={styles.sweep} aria-hidden />

        <div className={`relative z-[1] flex flex-col ${feature.mockup ? "flex-1 min-w-0" : "p-6 md:p-7 flex-1"}`}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <FeatureIconGlyph icon={feature.icon} />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FFBA6F]">
              {feature.label}
            </span>
            {isHighlighted && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFBA6F] text-[#1A1108]">
                New
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            {feature.description}
          </p>
        </div>

        {feature.mockup && (
          <div
            className={`${styles.phoneSlot} ${side === "right" ? styles.right : ""} flex shrink-0 justify-center self-center ${isWide ? "sm:justify-end sm:self-end" : "min-[1024px]:self-start"} ${phoneWidth}`}
          >
            <div className={styles.phoneEnter}>
              <div data-parallax className={styles.parallax}>
                <div className={styles.glow} aria-hidden />
                <div ref={shadowRef} className={styles.shadow} aria-hidden />
                <div ref={tiltRef} className={styles.tilt}>
                  {feature.video ? (
                    <DeviceFrame
                      type="video"
                      src={feature.video.src}
                      poster={feature.video.poster}
                      alt={feature.mockupAlt ?? feature.title}
                      shadow="none"
                      playThreshold={0.5}
                      visibilityRef={cardRef}
                    />
                  ) : (
                    <Image
                      src={feature.mockup}
                      alt={feature.mockupAlt ?? feature.title}
                      width={1530}
                      height={3036}
                      sizes="(min-width: 1024px) 200px, 160px"
                      className="h-auto w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!feature.mockup && (
          <div className="relative z-[1] px-6 pb-6 pt-2 mt-auto">
            <div className="flex items-center justify-center h-24 rounded-xl border border-neutral-800 bg-neutral-950/40">
              <FeatureIconGlyph icon={feature.icon} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const FeatureBento = memo(function FeatureBento() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnce(sectionRef);
  useBentoParallax(sectionRef);

  return (
    <section ref={sectionRef} className={`${styles.section} mb-20 md:mb-28`}>
      <Atmosphere />

      <div
        data-reveal="heading"
        className={`${styles.reveal} ${styles.headingReveal} relative z-[1] text-center mb-12 md:mb-14`}
      >
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
          Everything in one app
        </p>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mx-auto">
          Built for lifters who want structure, not guesswork.
        </h2>
      </div>

      <div className={`${styles.grid} flex flex-col gap-4 md:gap-5`}>
        {homeFeatureRows.map((row) => (
          <div
            key={row.join("-")}
            className="flex flex-col min-[1024px]:flex-row gap-4 md:gap-5 items-stretch"
          >
            {row.map((featureId, colIndex) => {
              const feature = homeFeatureMap[featureId];
              return (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  side={colIndex % 2 === 0 ? "left" : "right"}
                  className={
                    feature.span === "wide"
                      ? "min-[1024px]:flex-[2] min-w-0"
                      : "min-[1024px]:flex-1 min-w-0"
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
});
