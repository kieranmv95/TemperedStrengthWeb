"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { StoreDownloadRow } from "@/components/store/StoreBadges";
import { INSTAGRAM_URL } from "@/lib/site";
import { programs } from "@/data/programs";

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

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const hide = () => setShow(false);

    const tryPlay = async () => {
      try {
        // Some iOS versions only autoplay reliably after an explicit play() call.
        await v.play();
      } catch {
        // Autoplay blocked (e.g. iOS Low Power Mode). Fall back to the poster image.
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
        <SiteHeader className="mb-16 animate-fade-in" />

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-16 animate-fade-in-delay-1">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Train, learn, progress.
            <span className="mt-1 block bg-gradient-to-br from-[#f0e6c8] via-[#c9b072] to-[#8f7645] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(201,176,114,0.25)]">
              All in one place.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-loose">
            From heavy strength work to metcons and athletic prep, plus learning resources and an exclusive fitness discounts shop. <b>7 programs free, forever.</b>
          </p>

          <div>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-loose">Free to download. Free to start.</p>
            <StoreDownloadRow className="pt-4" />
          </div>
        </section>

        {/* Stats Bar + programs CTA */}
        <AnimatedSection className="mb-32 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: `${(programs.length - 1).toString()}+`, label: "Programs Available" },
              { value: programs.filter((program) => program.tier === "Free").length.toString(), label: "Free Programs" },
              { value: "150+", label: "Workouts" },
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
                Check out all {programs.length} programs, see the description, duration and sessions per week.
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
                    "The Hub: articles & glossary",
                    "Discounts & offers shop",
                    "Tools access",
                    "All video tutorials",
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
                    "Early access to new features",
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
      </div >
    </main >
  );
}
