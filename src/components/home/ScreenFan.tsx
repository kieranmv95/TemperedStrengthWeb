"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { moreAppScreens } from "@/data/homeFeatures";
import styles from "./ScreenFan.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FAN = "(min-width: 900px)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const PARALLAX_X = [16, 9, 3, 9, 16];
const PARALLAX_Y = [6, 4, 2, 4, 6];
const EASE = 0.08;
const DEAL_MS = 900 + 2 * 80;

type ItemStyle = CSSProperties & { "--pos": number; "--abs": number };

export function ScreenFan() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia(REDUCED_MOTION);
    const fan = window.matchMedia(FAN);
    const items = [...track.querySelectorAll<HTMLElement>("[data-item]")];
    const parallax = items.map((el) => el.querySelector<HTMLElement>("[data-parallax]"));

    const deal = () => {
      track.dataset.dealt = "";
      if (reduced.matches) {
        track.dataset.settled = "";
        return;
      }
      window.setTimeout(() => {
        track.dataset.settled = "";
      }, DEAL_MS + 400);
    };

    let dealObserver: IntersectionObserver | null = null;
    if (reduced.matches || typeof IntersectionObserver === "undefined") {
      deal();
    } else {
      dealObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          deal();
          dealObserver?.disconnect();
        },
        { threshold: 0.3 }
      );
      dealObserver.observe(track);
    }

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.intersectionRatio >= 0.7) el.dataset.active = "";
          else delete el.dataset.active;
        }
      },
      { root: track, threshold: [0, 0.7, 1] }
    );
    items.forEach((el) => activeObserver.observe(el));

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frame = 0;
    let lastTime = 0;

    const clearParallax = () => {
      parallax.forEach((el) => el && (el.style.transform = ""));
      delete track.dataset.hovering;
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
      lastTime = time;
      const k = 1 - Math.pow(1 - EASE, dt / 16.7);
      pointer.x += (pointer.targetX - pointer.x) * k;
      pointer.y += (pointer.targetY - pointer.y) * k;

      parallax.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate3d(${(pointer.x * PARALLAX_X[i]).toFixed(2)}px, ${(pointer.y * PARALLAX_Y[i]).toFixed(2)}px, 0)`;
      });

      const resting =
        Math.abs(pointer.targetX - pointer.x) < 0.002 &&
        Math.abs(pointer.targetY - pointer.y) < 0.002;
      if (!resting) {
        frame = requestAnimationFrame(tick);
        return;
      }
      frame = 0;
      lastTime = 0;
      if (pointer.targetX === 0 && pointer.targetY === 0) clearParallax();
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const enabled = () =>
      fan.matches && !reduced.matches && window.matchMedia(FINE_POINTER).matches;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled()) return;
      const rect = track.getBoundingClientRect();
      pointer.targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      pointer.targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      track.dataset.hovering = "";
      start();
    };

    const onLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      start();
    };

    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerleave", onLeave);

    return () => {
      dealObserver?.disconnect();
      activeObserver.disconnect();
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const centre = Math.floor(moreAppScreens.length / 2);

  return (
    <div ref={trackRef} className={styles.track}>
      {moreAppScreens.map((screen, i) => {
        const pos = i - centre;
        const style: ItemStyle = { "--pos": pos, "--abs": Math.abs(pos) };
        return (
          <figure key={screen.id} data-item className={styles.item} style={style}>
            <div className={styles.phoneWrap}>
              <div className={styles.deal}>
                <div data-parallax className={styles.parallax}>
                  <div className={styles.pose}>
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      width={1530}
                      height={3036}
                      sizes="(min-width: 1100px) 230px, (min-width: 900px) 196px, 62vw"
                      className={styles.phone}
                    />
                  </div>
                </div>
              </div>
            </div>
            <figcaption className={styles.label}>
              <h3 className="text-sm md:text-base font-semibold text-white">{screen.title}</h3>
              <p className="mt-1 text-xs md:text-sm text-neutral-500 leading-relaxed">
                {screen.caption}
              </p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
