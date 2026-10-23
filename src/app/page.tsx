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
  smartTrainingBullets,
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
          className={`w-4 h-4 ${i < rating ? "text-[#c9b072]" : "text-neutral-700"}`}
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
      <figure className="flex flex-col h-full p-6 md:p-7 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-[#c9b072]/35 transition-colors">
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
  const className = "w-5 h-5 text-[#c9b072]";

  switch (icon) {
    case "programs":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
    case "hub":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "perks":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      );
  }
}

function MockupPhone({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-[1.25rem] border border-neutral-700/80 bg-neutral-950/60 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={393}
        height={852}
        className="w-full h-auto rounded-[1.1rem]"
      />
    </div>
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
    ? "w-[140px] sm:w-[155px] md:w-[165px] lg:w-[180px]"
    : "w-[118px] sm:w-[128px]";

  return (
    <AnimatedSection
      animation="scale"
      delay={delay}
      className={["flex w-full", className].filter(Boolean).join(" ")}
    >
      <div
        className={`group relative flex flex-1 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${isHighlighted
          ? "border-[#c9b072]/40 bg-[#c9b072]/5 hover:border-[#c9b072]/55 hover:bg-[#c9b072]/8"
          : "border-neutral-800 bg-neutral-900/50 hover:border-[#c9b072]/35"
          } ${feature.mockup ? "flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-6 md:p-7" : "flex-col"}`}
      >
        {isHighlighted && (
          <>
            <div className="absolute inset-0 rounded-2xl overflow-hidden shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute top-4 right-4 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c9b072] text-black">
              New
            </span>
          </>
        )}

        <div className={`relative flex flex-col ${feature.mockup ? "flex-1 min-w-0" : "p-6 md:p-7 flex-1"}`}>
          <div className="flex items-center gap-2 mb-3">
            <FeatureIconGlyph icon={feature.icon} />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c9b072]">
              {feature.label}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            {feature.description}
          </p>
        </div>

        {feature.mockup && (
          <div className="flex shrink-0 justify-center sm:justify-end">
            <MockupPhone
              src={feature.mockup}
              alt={feature.mockupAlt ?? feature.title}
              className={phoneWidth}
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
    { value: `${programs.length}+`, label: "Programmes" },
    { value: WORKOUTS_COUNT, label: "Workouts" },
    { value: String(RECOVERY_FLOWS_COUNT), label: "Recovery & Mobility Flows" },
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(201,176,114,0.14),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Subtle grid background */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <SiteHeader className="mb-12 md:mb-16 animate-fade-in" />

        {/* Hero Section */}
        <section className="mb-20 md:mb-28 animate-fade-in-delay-1">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#c9b072]/35 text-[#c9b072] bg-[#c9b072]/10">
                Smart training app · iOS &amp; Android
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.12]">
                Train with a plan
                <span className="mt-1 block bg-gradient-to-br from-[#f0e6c8] via-[#c9b072] to-[#8f7645] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(201,176,114,0.25)]">
                  that adapts to you.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Structured programmes, on-demand workouts, recovery flows, and smart
                exercise swaps. Everything you need to train with intent, not
                guesswork.{" "}
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
              <div className="relative gold-glow rounded-[2rem] overflow-hidden">
                <Image
                  src="/mockups/homepage.png"
                  alt="Tempered Strength app home screen"
                  width={320}
                  height={640}
                  className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] h-auto"
                  priority
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
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#c9b072]">
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

        {/* Feature Bento Grid */}
        <section className="mb-20 md:mb-28">
          <AnimatedSection className="text-center mb-12 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
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
              <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium">
                Smart by design
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                No Gym is perfect.
                <span className="block text-neutral-400 mt-1">
                  Your app shouldn&apos;t pretend it is.
                </span>
              </h2>
              <ul className="space-y-4">
                {smartTrainingBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-300">
                    <CheckIcon className="w-5 h-5 text-[#c9b072] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <div className="relative rounded-[1.75rem] overflow-hidden border border-neutral-800">
                <Image
                  src="/mockups/homepage.png"
                  alt="Tempered Strength in-session view"
                  width={280}
                  height={560}
                  className="w-[240px] sm:w-[260px] md:w-[280px] h-auto"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Programs CTA */}
        <AnimatedSection className="mb-20 md:mb-28">
          <Link
            href="/programs"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 md:p-6 rounded-xl border border-[#c9b072]/25 bg-[#c9b072]/5 hover:border-[#c9b072]/45 hover:bg-[#c9b072]/10 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[#c9b072] uppercase tracking-wider mb-1">
                Full program breakdown
              </p>
              <p className="text-neutral-300 text-sm md:text-base">
                Browse all {programs.length} programmes plus {RECOVERY_FLOWS_COUNT}{" "}
                recovery flows, with descriptions, duration, and sessions per week.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm shrink-0">
              Browse all programmes
              <svg
                className="w-5 h-5 text-[#c9b072]"
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
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
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
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-4">
              Start free
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Free &amp; Pro
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Start free, upgrade when you&apos;re ready. Most of our programmes
              are completely free.
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
                    <li key={item} className="flex items-center gap-3 text-neutral-300">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
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
              <div className="relative p-8 rounded-2xl border border-[#c9b072]/50 bg-gradient-to-b from-[#c9b072]/5 to-transparent overflow-hidden backdrop-blur-sm h-full">
                <div className="absolute top-0 right-0 px-4 py-1 bg-[#c9b072] text-black text-xs font-bold uppercase">
                  Pro
                </div>
                <div className="text-sm font-medium text-[#c9b072] uppercase tracking-wider mb-2">
                  Pro
                </div>
                <h3 className="text-2xl font-bold mb-4">Level Up</h3>
                <ul className="space-y-3 mb-8">
                  {proTierFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-neutral-300">
                      <CheckIcon className="w-5 h-5 text-[#c9b072] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-3xl font-bold text-[#c9b072]">
                  £4.99mo / £49.99yr
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Download CTA */}
        <AnimatedSection animation="scale">
          <section className="relative mb-16">
            <div className="relative p-8 md:p-12 rounded-2xl border border-[#c9b072]/30 bg-gradient-to-br from-[#c9b072]/5 via-transparent to-transparent overflow-hidden backdrop-blur-sm">
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
                className="hover:text-[#c9b072] transition-colors"
              >
                Programs
              </Link>
              <Link
                href="/patch-notes"
                className="hover:text-[#c9b072] transition-colors"
              >
                Patch Notes
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c9b072] transition-colors"
              >
                Instagram
              </a>
              <a
                href="/terms"
                className="hover:text-[#c9b072] transition-colors"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="/privacy"
                className="hover:text-[#c9b072] transition-colors"
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
