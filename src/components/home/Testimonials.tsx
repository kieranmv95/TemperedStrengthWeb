"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeTestimonial } from "@/data/homeTestimonials";
import styles from "./Testimonials.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Enough cards per set that one set is always wider than the container. */
const MIN_PER_SET = 4;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`${styles.star} w-4 h-4 ${i < rating ? "text-[#FFBA6F]" : "text-neutral-700"}`}
          style={{ "--i": i } as CSSProperties}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  className = "",
  decorative = false,
}: {
  testimonial: HomeTestimonial;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <figure
      data-testimonial
      aria-hidden={decorative || undefined}
      className={`${styles.card} ${className} flex flex-col p-6 md:p-7 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-[#FFBA6F]/35 transition-colors`}
    >
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-neutral-300 text-sm md:text-base leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 pt-5 border-t border-neutral-800">
        <p className="text-xs md:text-sm text-neutral-500">{testimonial.detail}</p>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  className = "",
}: {
  items: HomeTestimonial[];
  reverse?: boolean;
  className?: string;
}) {
  const copies = Math.max(1, Math.ceil(MIN_PER_SET / items.length));
  const set = (clone: boolean) => (
    <div className={`${styles.set} ${clone ? styles.clone : ""}`} aria-hidden={clone || undefined}>
      {Array.from({ length: copies }, (_, copy) =>
        items.map((t) => (
          <TestimonialCard
            key={`${copy}-${t.id}`}
            testimonial={t}
            className={copy > 0 ? styles.repeat : ""}
            decorative={copy > 0}
          />
        ))
      )}
    </div>
  );

  return (
    <div className={`${styles.marquee} ${className}`}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ""}`}>
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: HomeTestimonial[] }) {
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = rowsRef.current;
    if (!rows) return;
    const cards = [...rows.querySelectorAll<HTMLElement>("[data-testimonial]")];
    const fill = (el: HTMLElement) => {
      el.dataset.starsIn = "";
    };

    if (window.matchMedia(REDUCED_MOTION).matches || typeof IntersectionObserver === "undefined") {
      cards.forEach(fill);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          fill(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.6 }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const half = Math.ceil(testimonials.length / 2);
  const top = testimonials.slice(0, half);
  const bottom = testimonials.slice(half);

  return (
    <Reveal as="section" className="mb-20 md:mb-28" aria-labelledby="testimonials-heading">
      <div className="text-center mb-12 md:mb-14">
        <p
          data-reveal-item
          className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4"
        >
          From the community
        </p>
        <h2
          id="testimonials-heading"
          data-reveal-item
          className="text-3xl md:text-4xl font-bold mb-5 leading-tight max-w-2xl mx-auto"
        >
          Lifters who train with intent.
        </h2>
        <p data-reveal-item className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Real feedback from people using Tempered Strength to stay consistent,
          swap exercises when kit isn&apos;t available, and train with a plan
          that fits their week.
        </p>
      </div>

      <div ref={rowsRef} data-reveal-item className="flex flex-col gap-5">
        <MarqueeRow items={testimonials} className="md:hidden" />
        <MarqueeRow items={top} className="hidden md:block" />
        <MarqueeRow items={bottom} reverse className="hidden md:block" />
      </div>
    </Reveal>
  );
}
