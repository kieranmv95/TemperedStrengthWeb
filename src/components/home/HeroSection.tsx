import { DeviceFrame } from "@/components/device/DeviceFrame";
import { SmartDownload } from "@/components/store/SmartDownload";
import type { Platform } from "@/lib/platform";
import styles from "./HeroSection.module.css";

const HERO_VIDEO = "/video-mockups/hero.mp4";
const HERO_POSTER = "/video-mockups/hero-poster.jpg";
const HERO_ALT =
  "Opening today's Back Squat session from Home, logging a set, and the rest timer starting";

type HeroSectionProps = {
  freeProgramCount: number;
  platform: Platform;
};

export function HeroSection({ freeProgramCount, platform }: HeroSectionProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading" data-site-hero>
      <div className={styles.copy}>
        <h1
          id="hero-heading"
          className="mt-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.12]"
        >
          <span className={`${styles.line} ${styles.delay1} block`}>Train with a plan</span>
          <span
            className={`${styles.line} ${styles.delay2} mt-1 block bg-gradient-to-br from-[#FFCA91] via-[#FFBA6F] to-[#FFBA6F] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,186,111,0.25)]`}
          >
            that adapts to you.
          </span>
        </h1>

        <p
          className={`${styles.line} ${styles.delay3} mt-6 text-lg md:text-xl text-neutral-400 max-w-xl mx-auto md:mx-0 leading-relaxed`}
        >
          Programmes, one-off workouts, and recovery, with logging built in.
        </p>

        <div className={`${styles.line} ${styles.delay4} mt-6 space-y-3`}>
          <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium">
            Free to download · Free to start
          </p>
          <SmartDownload platform={platform} alignStart />
        </div>
      </div>

      <div className={styles.phoneColumn}>
        <DeviceFrame
          type="video"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          alt={HERO_ALT}
          width="100%"
          glow
          shadow="deep"
        />
      </div>
    </section>
  );
}
