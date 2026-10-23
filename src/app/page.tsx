"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { StoreDownloadRow } from "@/components/store/StoreBadges";
import { INSTAGRAM_URL } from "@/lib/site";
import { programs } from "@/data/programs";
import {
  homeFeatureRows,
  homeFeatureMap,
  RECOVERY_FLOWS_COUNT,
  WORKOUTS_COUNT,
  sessionBullets,
  sessionPhones,
  moreAppScreens,
  freeTierFeatures,
  proTierFeatures,
  type FeatureIcon,
  type HomeFeature,
} from "@/data/homeFeatures";
import { homeTestimonials } from "@/data/homeTestimonials";

function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 8% 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const hide = () => setShow(false);

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        hide();
      }
    };

    void tryPlay();

    v.addEventListener("error", hide);
    v.addEventListener("stalled", hide);
    return () => {
      v.removeEventListener("error", hide);
      v.removeEventListener("stalled", hide);
    };
  }, []);

  if (!show) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover scale-110 pointer-events-none motion-reduce:hidden"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/lifting.jpg"
      aria-hidden="true"
      controls={false}
      disablePictureInPicture
    >
      <source src="/BG.mp4" type="video/mp4" />
    </video>
  );
}

function AnimatedSection({
  children,
  className = "",
  animation = "slide-up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "slide-up" | "slide-left" | "slide-right" | "scale";
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  const animationClass = {
    "slide-up": "scroll-animate",
    "slide-left": "scroll-animate-left",
    "slide-right": "scroll-animate-right",
    scale: "scroll-animate-scale",
  }[animation];

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? "animate-in" : ""} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-[#FFBA6F]" : "text-neutral-700"}`}
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
  quote,
  detail,
  rating,
  delay = 0,
}: {
  quote: string;
  detail: string;
  rating: number;
  delay?: number;
}) {
  return (
    <AnimatedSection animation="scale" delay={delay}>
      <figure className="flex flex-col h-full p-6 md:p-7 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-[#FFBA6F]/35 transition-colors">
        <StarRating rating={rating} />
        <blockquote className="mt-4 flex-1 text-neutral-300 text-sm md:text-base leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-5 pt-5 border-t border-neutral-800">
          <p className="text-xs md:text-sm text-neutral-500">{detail}</p>
        </figcaption>
      </figure>
    </AnimatedSection>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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

function DeviceFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "280px",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1530}
      height={3036}
      priority={priority}
      sizes={sizes}
      className={`h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
}

function TemperedDailySpotlight() {
  const feature = homeFeatureMap.daily;
  const points = [
    { label: "7 sessions", detail: "Do the days you can" },
    { label: "RX and Scaled", detail: "Two versions of every day" },
    { label: "Every Monday", detail: "A new week at 00:01" },
  ];

  return (
    <AnimatedSection className="mb-16 md:mb-24">
      <section
        aria-labelledby="tempered-daily-heading"
        className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#FFBA6F] bg-[#16120c] shadow-[0_0_90px_rgba(255,186,111,0.22)]"
      >
        <div className="pointer-events-none absolute -top-40 -right-16 h-96 w-96 rounded-full bg-[#FFBA6F]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full bg-[#FFCA91]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,186,111,0.2),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 shimmer opacity-40" />

        <div className="relative grid items-center gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:p-14">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-[#FFBA6F] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1108] shadow-[0_0_24px_rgba(255,186,111,0.45)]">
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
              A new week,
              <span className="block text-[#FFBA6F]">every Monday.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base md:text-lg text-neutral-200 leading-relaxed">
              The biggest thing on the way. Not in the app yet. Seven sessions a
              week, each with an RX and a Scaled version. Train the days you can.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-3">
              {points.map((point) => (
                <li
                  key={point.label}
                  className="rounded-xl border border-[#FFBA6F]/40 bg-[#FFBA6F]/10 px-4 py-3"
                >
                  <p className="text-sm font-bold text-[#FFCA91]">{point.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{point.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-sm md:text-base text-neutral-400 leading-relaxed">
              Each week has a theme, and the theme changes. Strength one block,
              a metcon the next, and something else after that. The aim is a
              well-rounded athlete. Pro opens the full week. Free accounts will
              see the shape of the day, then a lock.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-[230px] sm:w-[270px] lg:w-[320px]">
              <DeviceFrame
                src={feature.mockup ?? ""}
                alt={feature.mockupAlt ?? feature.title}
                sizes="(min-width: 1024px) 320px, 270px"
              />
            </div>
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#FFCA91]">
              Preview
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

function FeatureCard({
  feature,
  delay = 0,
  className = "",
}: {
  feature: HomeFeature;
  delay?: number;
  className?: string;
}) {
  const isWide = feature.span === "wide";
  const isHighlighted = feature.highlighted;
  const phoneWidth = isWide
    ? "w-[168px] sm:w-[188px] lg:w-[200px]"
    : "w-[156px] sm:w-[168px]";

  return (
    <AnimatedSection
      animation="scale"
      delay={delay}
      className={["flex w-full", className].filter(Boolean).join(" ")}
    >
      <div
        className={`group relative flex flex-1 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${isHighlighted
          ? "border-[#FFBA6F]/40 bg-[#FFBA6F]/5 hover:border-[#FFBA6F]/55 hover:bg-[#FFBA6F]/8"
          : "border-neutral-800 bg-neutral-900/50 hover:border-[#FFBA6F]/35"
          } ${feature.mockup
            ? isWide
              ? "flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 p-6 md:p-7"
              : "flex-col gap-5 p-6 md:p-7"
            : "flex-col"}`}
      >
        {isHighlighted && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        <div className={`relative flex flex-col ${feature.mockup ? "flex-1 min-w-0" : "p-6 md:p-7 flex-1"}`}>
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
          <div className={`flex shrink-0 justify-center ${isWide ? "sm:justify-end" : ""} ${phoneWidth}`}>
            <DeviceFrame
              src={feature.mockup}
              alt={feature.mockupAlt ?? feature.title}
              sizes="(min-width: 1024px) 200px, 160px"
            />
          </div>
        )}

        {!feature.mockup && (
          <div className="px-6 pb-6 pt-2 mt-auto">
            <div className="flex items-center justify-center h-24 rounded-xl border border-neutral-800 bg-neutral-950/40">
              <FeatureIconGlyph icon={feature.icon} />
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

export default function Home() {
  const scrollY = useParallax();
  const freeProgramCount = programs.filter((p) => p.tier === "Free").length;

  const stats = [
    { value: String(programs.length), label: "Programmes" },
    { value: WORKOUTS_COUNT, label: "Workouts" },
    { value: String(RECOVERY_FLOWS_COUNT), label: "Recovery flows" },
    { value: String(freeProgramCount), label: "Free Programmes" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background image with parallax */}
      <div
        className="absolute top-0 left-0 right-0 h-[70vh] md:h-screen z-0 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src="/lifting.jpg"
          alt=""
          fill
          className="object-cover scale-110"
          priority
          quality={75}
        />
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255, 186, 111,0.14),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Subtle grid background */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(255, 186, 111,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255, 186, 111,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-12 md:mb-16 animate-fade-in" />

        {/* Hero Section */}
        <section className="mb-20 md:mb-28 animate-fade-in-delay-1">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FFBA6F]/35 text-[#FFBA6F] bg-[#FFBA6F]/10">
                Local-first training · iOS &amp; Android
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.12]">
                Train with a plan
                <span className="mt-1 block bg-gradient-to-br from-[#FFCA91] via-[#FFBA6F] to-[#FFBA6F] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255, 186, 111,0.25)]">
                  that adapts to you.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Programmes, one-off workouts, logging, and recovery, kept on your
                phone. Run one block at a time, or open a session on its own.{" "}
                <span className="text-neutral-200 font-medium">
                  {freeProgramCount} programmes free, forever.
                </span>
              </p>

              <div className="space-y-3">
                <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium">
                  Free to download · Free to start
                </p>
                <StoreDownloadRow className="justify-center lg:justify-start" />
              </div>
            </div>

            <div
              className="relative flex justify-center lg:justify-end"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              <div className="w-[250px] sm:w-[280px] md:w-[300px] lg:w-[340px]">
                <DeviceFrame
                  src="/iphone-mockups/home-screen-portrait.png"
                  alt="Tempered Strength home screen with today’s workout, rest day, and training streak"
                  priority
                  sizes="(min-width: 1024px) 340px, 280px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <AnimatedSection className="mb-20 md:mb-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} animation="scale" delay={i * 0.08}>
                <div className="text-center p-5 md:p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm h-full">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFBA6F]">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        <TemperedDailySpotlight />

        {/* Feature Bento Grid */}
        <section className="mb-20 md:mb-28">
          <AnimatedSection className="text-center mb-12 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
              Everything in one app
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mx-auto">
              Built for lifters who want structure, not guesswork.
            </h2>
          </AnimatedSection>

          <div className="flex flex-col gap-4 md:gap-5">
            {homeFeatureRows.map((row, rowIndex) => (
              <div
                key={row.join("-")}
                className="flex flex-col min-[1024px]:flex-row gap-4 md:gap-5 items-stretch"
              >
                {row.map((featureId, colIndex) => {
                  const feature = homeFeatureMap[featureId];
                  const delay = rowIndex * 0.07 + colIndex * 0.04;
                  return (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      delay={delay}
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

        {/* Smart Training Spotlight */}
        <AnimatedSection className="mb-20 md:mb-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center rounded-2xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm p-8 md:p-10 lg:p-12">
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
              <ul className="space-y-4">
                {sessionBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-300">
                    <CheckIcon className="w-5 h-5 text-[#FFBA6F] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-end justify-center gap-3 sm:gap-5">
              <div className="w-[46%] max-w-[210px]">
                <DeviceFrame
                  src={sessionPhones[0].src}
                  alt={sessionPhones[0].alt}
                  sizes="210px"
                />
              </div>
              <div className="w-[40%] max-w-[180px] mb-6 sm:mb-10">
                <DeviceFrame
                  src={sessionPhones[1].src}
                  alt={sessionPhones[1].alt}
                  sizes="180px"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <section className="mb-20 md:mb-28" aria-labelledby="more-screens-heading">
          <AnimatedSection className="text-center mb-12 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
              Also in the app
            </p>
            <h2
              id="more-screens-heading"
              className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mx-auto"
            >
              From the workout to the record.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-6">
            {moreAppScreens.map((screen, i) => (
              <AnimatedSection key={screen.id} animation="scale" delay={i * 0.05}>
                <figure className="flex flex-col items-center text-center h-full">
                  <div className="w-[132px] sm:w-[148px] md:w-[156px]">
                    <DeviceFrame src={screen.src} alt={screen.alt} sizes="160px" />
                  </div>
                  <figcaption className="mt-4">
                    <h3 className="text-sm md:text-base font-semibold text-white">
                      {screen.title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-neutral-500 leading-relaxed">
                      {screen.caption}
                    </p>
                  </figcaption>
                </figure>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Programs CTA */}
        <AnimatedSection className="mb-20 md:mb-28">
          <Link
            href="/programs"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 md:p-6 rounded-xl border border-[#FFBA6F]/25 bg-[#FFBA6F]/5 hover:border-[#FFBA6F]/45 hover:bg-[#FFBA6F]/10 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[#FFBA6F] uppercase tracking-wider mb-1">
                Full program breakdown
              </p>
              <p className="text-neutral-300 text-sm md:text-base">
                Every programme, the workout library, and {RECOVERY_FLOWS_COUNT}{" "}
                recovery flows. Level, length, and what each block is for.
                Tempered Daily is listed there too, marked coming soon.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm shrink-0">
              Browse all programmes
              <svg
                className="w-5 h-5 text-[#FFBA6F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </AnimatedSection>

        {/* Testimonials */}
        <section className="mb-20 md:mb-28" aria-labelledby="testimonials-heading">
          <AnimatedSection className="text-center mb-12 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
              From the community
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-bold mb-5 leading-tight max-w-2xl mx-auto"
            >
              Lifters who train with intent.
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Real feedback from people using Tempered Strength to stay consistent,
              swap exercises when kit isn&apos;t available, and train with a plan
              that fits their week.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {homeTestimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                detail={testimonial.detail}
                rating={testimonial.rating}
                delay={i * 0.06}
              />
            ))}
          </div>
        </section>

        {/* Free vs Pro */}
        <section className="mb-20 md:mb-28">
          <AnimatedSection className="text-center mb-12 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4">
              Start free
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Free &amp; Pro
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Free means anyone can use it. Pro is a subscription, or a promo
              code. A few features are in both, with a tighter limit on Free.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AnimatedSection animation="slide-left">
              <div className="p-8 rounded-2xl border border-neutral-700 bg-neutral-900/30 backdrop-blur-sm h-full">
                <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Free
                </div>
                <h3 className="text-2xl font-bold mb-4">Get Started</h3>
                <ul className="space-y-3 mb-8">
                  {freeTierFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-neutral-300">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-3xl font-bold">
                  £0
                  <span className="text-base font-normal text-neutral-500">
                    {" "}
                    / forever
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right" delay={0.1}>
              <div className="relative p-8 rounded-2xl border border-[#FFBA6F]/50 bg-gradient-to-b from-[#FFBA6F]/5 to-transparent overflow-hidden backdrop-blur-sm h-full">
                <div className="absolute top-0 right-0 px-4 py-1 bg-[#FFBA6F] text-[#1A1108] text-xs font-bold uppercase">
                  Pro
                </div>
                <div className="text-sm font-medium text-[#FFBA6F] uppercase tracking-wider mb-2">
                  Pro
                </div>
                <h3 className="text-2xl font-bold mb-4">Level Up</h3>
                <ul className="space-y-3 mb-8">
                  {proTierFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-neutral-300">
                      <CheckIcon className="w-5 h-5 text-[#FFBA6F] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-3xl font-bold text-[#FFBA6F]">
                  £4.99mo / £49.99yr
                </div>
              </div>
            </AnimatedSection>
          </div>

          <p className="mt-8 max-w-3xl mx-auto text-center text-sm text-neutral-400 leading-relaxed">
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
        </section>

        {/* Download CTA */}
        <AnimatedSection animation="scale">
          <section className="relative mb-16">
            <div className="relative p-8 md:p-12 rounded-2xl border border-[#FFBA6F]/30 bg-gradient-to-br from-[#FFBA6F]/5 via-transparent to-transparent overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 shimmer pointer-events-none" />

              <div className="relative text-center space-y-6 max-w-xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Your next programme is one download away.
                </h2>
                <p className="text-neutral-400">
                  Download Tempered Strength for free and start training today.
                  Upgrade to Pro when you&apos;re ready for the full library.
                </p>

                <StoreDownloadRow className="pt-2" />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Footer */}
        <footer className="text-sm text-neutral-600 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/programs"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Programs
              </Link>
              <Link
                href="/patch-notes"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Patch Notes
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Instagram
              </a>
              <a
                href="/terms"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="/privacy"
                className="hover:text-[#FFBA6F] transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
