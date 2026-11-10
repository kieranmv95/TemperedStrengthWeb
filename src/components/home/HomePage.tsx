"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DownloadCta } from "@/components/home/DownloadCta";
import { FeatureBento } from "@/components/home/FeatureBento";
import { HeroSection } from "@/components/home/HeroSection";
import { Pricing } from "@/components/home/Pricing";
import { ScreenFan } from "@/components/home/ScreenFan";
import { SessionSpotlight } from "@/components/home/SessionSpotlight";
import { StatsRow } from "@/components/home/StatsRow";
import { TemperedDailySpotlight } from "@/components/home/TemperedDailySpotlight";
import { Testimonials } from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import type { Platform } from "@/lib/platform";
import { INSTAGRAM_URL } from "@/lib/site";
import { programs } from "@/data/programs";
import { RECOVERY_FLOWS_COUNT, WORKOUTS_COUNT } from "@/data/homeFeatures";
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

export function HomePage({ platform }: { platform: Platform }) {
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

        <HeroSection freeProgramCount={freeProgramCount} platform={platform} />

        <StatsRow stats={stats} />

        <TemperedDailySpotlight />

        <FeatureBento />

        <SessionSpotlight />

        <section className="mb-20 md:mb-28" aria-labelledby="more-screens-heading">
          <Reveal className="text-center mb-12 md:mb-14">
            <p
              data-reveal-item
              className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#FFBA6F] font-medium mb-4"
            >
              Also in the app
            </p>
            <h2
              id="more-screens-heading"
              data-reveal-item
              className="text-3xl md:text-4xl font-bold leading-tight max-w-2xl mx-auto"
            >
              From the workout to the record.
            </h2>
          </Reveal>

          <ScreenFan />
        </section>

        <Testimonials testimonials={homeTestimonials} />

        <Pricing />

        <DownloadCta platform={platform} />

        {/* Footer */}
        <footer className="text-sm text-neutral-600 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
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
