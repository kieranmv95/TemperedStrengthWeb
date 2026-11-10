"use client";

import { useEffect, useRef } from "react";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { Atmosphere } from "@/components/motion/Atmosphere";
import conic from "@/components/motion/ConicBorder.module.css";
import { homeFeatureMap } from "@/data/homeFeatures";
import styles from "./TemperedDailySpotlight.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const DESKTOP = "(min-width: 1024px)";

const STAGGER = 80;
const REST_X = 6;
const REST_Y = -14;
const SCROLL_Y = -6;
const ENTER_Y = -24;
const ENTER_MS = 1000;
const MAX_TILT = 6;
const TILT_EASE = 0.1;

const points = [
  { label: "7 sessions", detail: "Do the days you can" },
  { label: "RX and Scaled", detail: "Two versions of every day" },
  { label: "Every Monday", detail: "A new week at 00:01" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 4;
}

export function TemperedDailySpotlight() {
  const feature = homeFeatureMap.daily;
  const cardRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const phone = phoneRef.current;
    if (!card || !phone) return;

    const reduced = window.matchMedia(REDUCED_MOTION);
    const finePointer = window.matchMedia(FINE_POINTER);
    const desktop = window.matchMedia(DESKTOP);
    const targets = [...card.querySelectorAll<HTMLElement>("[data-reveal]")];

    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const spot = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let hovering = false;
    let enterAt: number | null = null;
    let lastScroll = Number.NaN;
    let frame = 0;
    let lastTime = 0;
    let inView = false;

    const revealAll = (animate: boolean) => {
      targets.forEach((el, i) => {
        el.style.setProperty("--reveal-delay", animate ? `${i * STAGGER}ms` : "0ms");
        el.dataset.revealed = "";
      });
      phone.style.setProperty("--reveal-delay", animate ? `${targets.length * STAGGER}ms` : "0ms");
      phone.dataset.revealed = "";
    };

    const clearInline = () => {
      if (tiltRef.current) tiltRef.current.style.transform = "";
      if (shadowRef.current) shadowRef.current.style.transform = "";
      delete card.dataset.hovering;
    };

    const scrollAngle = () => {
      if (!desktop.matches) return REST_Y;
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      return REST_Y + (SCROLL_Y - REST_Y) * progress;
    };

    const tick = (time: number) => {
      frame = 0;
      if (reduced.matches) {
        clearInline();
        return;
      }

      const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
      lastTime = time;
      const k = 1 - Math.pow(1 - TILT_EASE, dt / 16.7);

      tilt.x += (tilt.targetX - tilt.x) * k;
      tilt.y += (tilt.targetY - tilt.y) * k;
      spot.x += (spot.targetX - spot.x) * k;
      spot.y += (spot.targetY - spot.y) * k;

      let entering = false;
      let enterOffset = 0;
      if (enterAt !== null) {
        const t = clamp((time - enterAt) / ENTER_MS, 0, 1);
        enterOffset = (ENTER_Y - REST_Y) * (1 - easeOut(t));
        entering = t < 1;
      }

      const base = scrollAngle();
      const rx = REST_X + tilt.x;
      const ry = base + enterOffset + tilt.y;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(1200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translate3d(${(-ry * 1.2).toFixed(2)}px, ${(18 + rx * 1.4).toFixed(2)}px, 0)`;
      }
      if (spotlightRef.current && hovering) {
        spotlightRef.current.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
      }

      const scrollMoved = base !== lastScroll;
      lastScroll = base;
      const settling =
        Math.abs(tilt.targetX - tilt.x) > 0.01 ||
        Math.abs(tilt.targetY - tilt.y) > 0.01 ||
        (hovering &&
          (Math.abs(spot.targetX - spot.x) > 0.5 || Math.abs(spot.targetY - spot.y) > 0.5));

      if (entering || settling || scrollMoved) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTime = 0;
      }
    };

    const start = () => {
      if (!frame && !reduced.matches) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (inView && desktop.matches) start();
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || reduced.matches) return;
      hovering = true;
      card.dataset.hovering = "";
      const rect = card.getBoundingClientRect();
      spot.x = spot.targetX = event.clientX - rect.left;
      spot.y = spot.targetY = event.clientY - rect.top;
      onMove(event);
    };

    const onMove = (event: PointerEvent) => {
      if (!hovering) return;
      const rect = card.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      spot.targetX = px;
      spot.targetY = py;
      tilt.targetY = clamp((px / rect.width) * 2 - 1, -1, 1) * MAX_TILT;
      tilt.targetX = -clamp((py / rect.height) * 2 - 1, -1, 1) * MAX_TILT;
      start();
    };

    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      delete card.dataset.hovering;
      tilt.targetX = 0;
      tilt.targetY = 0;
      start();
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        hovering = false;
        clearInline();
        revealAll(false);
      } else {
        start();
      }
    };

    if (reduced.matches || typeof IntersectionObserver === "undefined") {
      revealAll(false);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView || phone.dataset.revealed !== undefined) {
          if (inView) start();
          return;
        }
        const animate = !reduced.matches;
        revealAll(animate);
        if (animate) {
          enterAt = performance.now() + targets.length * STAGGER;
          start();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(card);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", onReducedChange);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onReducedChange);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div id="tempered-daily" className={`${styles.shell} mb-16 md:mb-24 scroll-mt-8`}>
      <Atmosphere className={styles.atmosphere} />
      <div className={conic.border} aria-hidden="true" />
      <section
        ref={cardRef}
        aria-labelledby="tempered-daily-heading"
        className={styles.card}
      >
        <div className="pointer-events-none absolute -top-40 -right-16 h-96 w-96 rounded-full bg-[#FFBA6F]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full bg-[#FFCA91]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,186,111,0.2),transparent_52%)]" />
        <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" />

        <div className="relative grid items-center gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:p-14">
          <div>
            <div data-reveal className={`${styles.reveal} flex flex-wrap items-center gap-3 mb-6`}>
              <span
                className={`${styles.badge} inline-flex items-center rounded-full bg-[#FFBA6F] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1108] shadow-[0_0_24px_rgba(255,186,111,0.45)]`}
              >
                Coming soon
              </span>
              <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#FFCA91]">
                {feature.label}
              </span>
            </div>
            <h2
              id="tempered-daily-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
            >
              <span data-reveal className={`${styles.reveal} block`}>
                A new week,
              </span>
              <span data-reveal className={`${styles.reveal} block text-[#FFBA6F]`}>
                every Monday.
              </span>
            </h2>
            <p
              data-reveal
              className={`${styles.reveal} mt-5 max-w-xl text-base md:text-lg text-neutral-200 leading-relaxed`}
            >
              The biggest thing on the way. Not in the app yet. Seven sessions a
              week, each with an RX and a Scaled version. Train the days you can.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-3">
              {points.map((point) => (
                <li
                  key={point.label}
                  data-reveal
                  className={`${styles.reveal} ${styles.chip} rounded-xl border border-[#FFBA6F]/40 bg-[#FFBA6F]/10 px-4 py-3`}
                >
                  <p className="text-sm font-bold text-[#FFCA91]">{point.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{point.detail}</p>
                </li>
              ))}
            </ul>
            <p
              data-reveal
              className={`${styles.reveal} mt-6 max-w-xl text-sm md:text-base text-neutral-400 leading-relaxed`}
            >
              Each week has a theme, and the theme changes. Strength one block,
              a metcon the next, and something else after that. The aim is a
              well-rounded athlete. Pro opens the full week. Free accounts will
              see the shape of the day, then a lock.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div ref={phoneRef} className={`${styles.phoneEnter} w-[230px] sm:w-[270px] lg:w-[320px]`}>
              <div className={styles.glow} aria-hidden="true" />
              <div ref={shadowRef} className={styles.shadow} aria-hidden="true" />
              <div ref={tiltRef} className={styles.tilt}>
                <DeviceFrame
                  type="image"
                  src="/images/tempered-daily.webp"
                  alt={feature.mockupAlt ?? feature.title}
                  shadow="none"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#FFCA91]">
              Preview
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
