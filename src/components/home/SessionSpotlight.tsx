"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { sessionBullets, sessionPhones } from "@/data/homeFeatures";
import styles from "./SessionSpotlight.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SLIDE = "(min-width: 768px)";

const STAGGER = 100;
const APART = 0.14;
const FRONT_PARALLAX = 26;
const BACK_PARALLAX = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SessionSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = [...list.querySelectorAll<HTMLElement>("li")];
    items.forEach((el, i) => el.style.setProperty("--reveal-delay", `${i * STAGGER}ms`));

    if (window.matchMedia(REDUCED_MOTION).matches || typeof IntersectionObserver === "undefined") {
      list.dataset.revealed = "";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        list.dataset.revealed = "";
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const slide = window.matchMedia(SLIDE);
    const reduced = window.matchMedia(REDUCED_MOTION);
    let frame = 0;
    let listening = false;

    const enabled = () => slide.matches && !reduced.matches;

    const reset = () => {
      if (frontRef.current) frontRef.current.style.transform = "";
      if (backRef.current) backRef.current.style.transform = "";
      delete section.dataset.sliding;
    };

    const update = () => {
      frame = 0;
      if (!enabled()) {
        reset();
        return;
      }

      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const together = clamp((vh - rect.top) / (vh * 0.7), 0, 1);
      const apart = (1 - together) * rect.width * APART;
      const half = vh / 2;
      const drift = clamp((half - (rect.top + rect.height / 2)) / (half + rect.height / 2), -1, 1);

      section.dataset.sliding = "";
      if (frontRef.current) {
        frontRef.current.style.transform = `translate3d(${(-apart).toFixed(2)}px, ${(drift * FRONT_PARALLAX).toFixed(2)}px, 0)`;
      }
      if (backRef.current) {
        backRef.current.style.transform = `translate3d(${apart.toFixed(2)}px, ${(drift * BACK_PARALLAX).toFixed(2)}px, 0)`;
      }
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
        delete section.dataset.sliding;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => setListening(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(stage);
    slide.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    schedule();

    return () => {
      observer.disconnect();
      setListening(false);
      slide.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const [logging, lockScreen] = sessionPhones;

  return (
    <div
      ref={sectionRef}
      className={`${styles.section} mb-20 md:mb-28 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center rounded-2xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm p-8 md:p-10 lg:p-12`}
    >
      <div className="space-y-6">
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium">
          In the session
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          Log the set.
          <span className="block text-neutral-400 mt-1">
            Rest. The timer stays with you.
          </span>
        </h2>
        <ul ref={listRef} className={`${styles.list} space-y-4`}>
          {sessionBullets.map((item) => (
            <li key={item} className={`${styles.item} flex items-start gap-3 text-neutral-300`}>
              <svg
                className="w-5 h-5 text-[#FFBA6F] flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
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
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={`${styles.slot} ${styles.front}`}>
          <div ref={frontRef} className={styles.motion}>
            <div className={styles.tilt}>
              <Image
                src={logging.src}
                alt={logging.alt}
                width={1530}
                height={3036}
                sizes="(min-width: 1024px) 260px, 52vw"
                className={styles.phone}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.slot} ${styles.back}`}>
          <div ref={backRef} className={styles.motion}>
            <div className={styles.tilt}>
              <Image
                src={lockScreen.src}
                alt={lockScreen.alt}
                width={1530}
                height={3036}
                sizes="(min-width: 1024px) 260px, 52vw"
                className={styles.phone}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
