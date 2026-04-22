"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { APP_STORE_URL, INSTAGRAM_URL } from "@/lib/site";

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
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

export default function Home() {
  const scrollY = useParallax();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background image with parallax */}
      <div
        className="absolute top-0 left-0 right-0 h-[65vh] md:h-screen z-0 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src="/lifting.jpg"
          alt=""
          fill
          className="object-cover scale-110"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Subtle grid background */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-center mb-16 animate-fade-in">
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={180}
            height={50}
            priority
            className="opacity-90"
          />
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-16 animate-fade-in-delay-1">
          <div className="flex flex-col items-center gap-4 md:gap-5">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium">
              Available now on the App Store
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Gym programs that
            <span className="block text-[#c9b072]">actually work.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-loose">
            Free and Pro strength & Olympic lifting programs designed by
            experts. Smart features that adapt when life gets in the way.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] gold-glow"
            >
              <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              Download on the App Store
            </a>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full max-w-3xl flex-wrap">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
              >
                Browse all programs
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
              >
                Read articles
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#c9b072]/50 text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 hover:bg-[#c9b072]/5"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>

        {/* Stats Bar + programs CTA */}
        <AnimatedSection className="mb-32 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "9", label: "Programs Available" },
              { value: "5", label: "Free Programs" },
              { value: "40+", label: "On-demand workouts" },
            ].map((stat, i) => (
              <AnimatedSection key={i} animation="scale" delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <div className="text-3xl md:text-4xl font-bold text-[#c9b072]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <Link
            href="/programs"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 md:p-6 rounded-xl border border-[#c9b072]/25 bg-[#c9b072]/5 hover:border-[#c9b072]/45 hover:bg-[#c9b072]/10 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[#c9b072] uppercase tracking-wider mb-1">
                Full program breakdown
              </p>
              <p className="text-neutral-300 text-sm md:text-base">
                Nine blocks — session frequency, duration, and Free vs Pro at a
                glance.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm shrink-0">
              Browse all programs
              <svg
                className="w-5 h-5 text-[#c9b072]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

        {/* Programs Section */}
        <section id="programs" className="mb-32 scroll-mt-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection
              animation="slide-left"
              className="order-2 md:order-1 flex justify-center"
            >
              <div className="relative w-64 md:w-72">
                <Image
                  src="/program_popup_3d.png"
                  alt="Program selection screen"
                  width={320}
                  height={640}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="slide-right"
              className="order-1 md:order-2 text-center md:text-left"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                Programs for Every Lifter
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Nine structured programs in the app — five free, four Pro —
                covering hypertrophy, powerbuilding, powerlifting peaking, and
                Olympic lifting. Pick a block that fits your schedule and goals.
              </p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-2 h-2 rounded-full bg-[#c9b072]" />
                  Push/Pull/Legs splits
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-2 h-2 rounded-full bg-[#c9b072]" />
                  Foundation strength programs
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-2 h-2 rounded-full bg-[#c9b072]" />
                  Olympic lifting progressions
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-2 h-2 rounded-full bg-[#c9b072]" />
                  Customizable workout days
                </li>
              </ul>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 mt-8 mx-auto md:mx-0 border border-[#c9b072]/50 hover:bg-[#c9b072]/10 text-[#c9b072] font-semibold px-6 py-3 rounded-lg transition-all duration-200"
              >
                See every program
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Smart Features
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Training tools that adapt to real life. Because the perfect
              workout is the one you can actually do.
            </p>
          </AnimatedSection>

          {/* On-Demand Workouts Feature */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            <AnimatedSection
              animation="slide-left"
              className="order-2 md:order-1 flex justify-center"
            >
              <div className="relative w-56 md:w-64">
                <Image
                  src="/workouts_3d.png"
                  alt="On-demand workouts screen"
                  width={280}
                  height={560}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="slide-right"
              className="order-1 md:order-2 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug">
                On-Demand Workouts
              </h3>
              <p className="text-neutral-400 leading-loose mb-4">
                Need to feel the burn but don&apos;t have time for a full
                program? Pick from our library of 40+ one-off workouts for
                quick, effective sessions. Filter by type, difficulty, and
                equipment.
              </p>
              <div className="inline-flex items-center text-[#c9b072] text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c9b072] mr-2" />
                Full library with Pro
              </div>
            </AnimatedSection>
          </div>

          {/* The Brief Feature */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            <AnimatedSection
              animation="slide-left"
              className="order-1 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug">
                The Brief
              </h3>
              <p className="text-neutral-400 leading-loose mb-4">
                Your daily intel for the iron game. Curated fitness articles on
                methodology, nutrition, recovery, and mindset. Plus Apple Music
                playlists for your sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-stretch sm:items-center mb-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center gap-2 bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Browse articles
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
              <div className="inline-flex items-center text-green-500 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Free for everyone
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="slide-right"
              className="order-2 flex justify-center"
            >
              <div className="relative w-56 md:w-64">
                <Image
                  src="/brief_3d.png"
                  alt="The Brief screen"
                  width={280}
                  height={560}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Smart Swapping Feature */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            <AnimatedSection
              animation="slide-left"
              className="order-2 md:order-1 flex justify-center"
            >
              <div className="relative w-56 md:w-64">
                <Image
                  src="/exercise_swap_3d.png"
                  alt="Exercise swap screen"
                  width={280}
                  height={560}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="slide-right"
              className="order-1 md:order-2 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug">
                Smart Exercise Swapping
              </h3>
              <p className="text-neutral-400 leading-loose mb-4">
                Equipment unavailable? Tap to swap any exercise for an
                alternative that targets the same muscle groups. Choose from
                cable, machine, bodyweight, or dumbbell alternatives.
              </p>
              <div className="inline-flex items-center text-[#c9b072] text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c9b072] mr-2" />
                Unlimited swaps with Pro
              </div>
            </AnimatedSection>
          </div>

          {/* Glossary Feature */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <AnimatedSection
              animation="slide-left"
              className="order-1 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9b072]/20 to-[#c9b072]/5 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg
                  className="w-7 h-7 text-[#c9b072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug">
                Gym Terminology
              </h3>
              <p className="text-neutral-400 leading-loose mb-4">
                New to the gym? Our searchable glossary decodes common lingo
                like AMRAP, DOMS, concentric, and hypertrophy. Filter by
                training, movements, or nutrition categories.
              </p>
              <div className="inline-flex items-center text-green-500 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Free for everyone
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="slide-right"
              className="order-2 flex justify-center"
            >
              <div className="relative w-56 md:w-64">
                <Image
                  src="/glossary_3d.png"
                  alt="Terminology glossary screen"
                  width={280}
                  height={560}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Free vs Pro */}
        <section className="mb-32">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Free & Pro
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Start free, upgrade when you&apos;re ready. Most of our programs
              are completely free.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <AnimatedSection animation="slide-left">
              <div className="p-8 rounded-2xl border border-neutral-700 bg-neutral-900/30 backdrop-blur-sm h-full">
                <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Free
                </div>
                <h3 className="text-2xl font-bold mb-4">Get Started</h3>
                <ul className="space-y-3 mb-8">
                  {[
                    "Multiple complete training programs",
                    "On-demand workouts (limited)",
                    "The Brief: articles, playlists & glossary",
                    "10 Smart exercise swaps per month",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-neutral-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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

            {/* Pro Tier */}
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
                  {[
                    "Everything in Free",
                    "All PRO programs available",
                    "Full on-demand workouts library",
                    "Unlimited Smart exercise swaps",
                    "Exclusive content & features",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-neutral-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#c9b072] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                  Ready to start training?
                </h2>
                <p className="text-neutral-400">
                  Download Tempered Strength for free and start your first
                  program today. Upgrade to Pro when you&apos;re ready.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#c9b072] hover:bg-[#d4c08a] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    Download on the App Store
                  </a>
                </div>
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
                Terms & Conditions
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
