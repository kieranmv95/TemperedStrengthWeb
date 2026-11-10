import { Atmosphere } from "@/components/motion/Atmosphere";
import { Reveal } from "@/components/motion/Reveal";
import { SmartDownload } from "@/components/store/SmartDownload";
import type { Platform } from "@/lib/platform";
import styles from "./DownloadCta.module.css";

export function DownloadCta({ platform }: { platform: Platform }) {
  return (
    <Reveal as="section" className="relative mb-16" aria-labelledby="download-cta-heading" stagger={90}>
      <Atmosphere />
      <div className="relative p-8 md:p-12 rounded-2xl border border-[#FFBA6F]/30 bg-gradient-to-br from-[#FFBA6F]/5 via-transparent to-transparent overflow-hidden backdrop-blur-sm">
        <div className={styles.glow} aria-hidden="true" />

        <div className="relative text-center space-y-6 max-w-xl mx-auto">
          <h2 id="download-cta-heading" data-reveal-item className="text-2xl md:text-3xl font-bold">
            Your next programme is one download away.
          </h2>
          <p data-reveal-item className="text-neutral-400">
            Download Tempered Strength for free and start training today.
            Upgrade to Pro when you&apos;re ready for the full library.
          </p>
          <div data-reveal-item="pop" className="pt-2">
            <SmartDownload platform={platform} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
