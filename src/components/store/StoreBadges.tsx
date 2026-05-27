import Image from "next/image";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_ENABLED,
  GOOGLE_PLAY_URL,
} from "@/lib/site";

export const APP_STORE_BADGE_SRC =
  "/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
export const GOOGLE_PLAY_BADGE_SRC = "/Google_Play_Store_badge_EN.svg.png";

/** Intrinsic dimensions from official badge assets */
const APP_STORE_BADGE_WIDTH = 120;
const APP_STORE_BADGE_HEIGHT = 40;
const GOOGLE_PLAY_BADGE_WIDTH = 500;
const GOOGLE_PLAY_BADGE_HEIGHT = 149;

const badgeImageClass = "h-10 w-auto";

type BadgeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

function BadgeImage({
  src,
  alt,
  width,
  height,
  className = "",
}: BadgeImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${badgeImageClass} ${className}`}
    />
  );
}

type AppStoreBadgeProps = {
  href?: string;
  className?: string;
};

export function AppStoreBadge({
  href = APP_STORE_URL,
  className = "",
}: AppStoreBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9b072] ${className}`}
      aria-label="Download on the App Store"
    >
      <BadgeImage
        src={APP_STORE_BADGE_SRC}
        alt="Download on the App Store"
        width={APP_STORE_BADGE_WIDTH}
        height={APP_STORE_BADGE_HEIGHT}
      />
    </a>
  );
}

type GooglePlayBadgeProps = {
  href?: string;
  enabled?: boolean;
  className?: string;
};

export function GooglePlayBadge({
  href = GOOGLE_PLAY_URL,
  enabled = GOOGLE_PLAY_ENABLED,
  className = "",
}: GooglePlayBadgeProps) {
  const image = (
    <BadgeImage
      src={GOOGLE_PLAY_BADGE_SRC}
      alt="Get it on Google Play"
      width={GOOGLE_PLAY_BADGE_WIDTH}
      height={GOOGLE_PLAY_BADGE_HEIGHT}
    />
  );

  if (!enabled || !href) {
    return (
      <span
        className={`relative inline-block cursor-not-allowed ${className}`}
        aria-disabled="true"
        title="Google Play — coming soon"
      >
        <span className="block opacity-45 grayscale">{image}</span>
        <span className="absolute -right-1 -top-2 rounded-full border border-[#c9b072]/40 bg-[#0a0a0a] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#c9b072]">
          Coming soon
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9b072] ${className}`}
      aria-label="Get it on Google Play"
    >
      {image}
    </a>
  );
}

type StoreDownloadRowProps = {
  appStoreHref?: string;
  googlePlayHref?: string;
  googlePlayEnabled?: boolean;
  className?: string;
  layout?: "row" | "column";
};

export function StoreDownloadRow({
  appStoreHref,
  googlePlayHref,
  googlePlayEnabled,
  className = "",
  layout = "row",
}: StoreDownloadRowProps) {
  const layoutClass =
    layout === "column"
      ? "flex flex-col items-center gap-3"
      : "flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:items-center";

  return (
    <div className={`${layoutClass} ${className}`}>
      <AppStoreBadge href={appStoreHref} />
      <GooglePlayBadge href={googlePlayHref} enabled={googlePlayEnabled} />
    </div>
  );
}

/** Compact badge for link list rows (decorative; parent provides label). */
export function AppStoreBadgeIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src={APP_STORE_BADGE_SRC}
      alt=""
      width={APP_STORE_BADGE_WIDTH}
      height={APP_STORE_BADGE_HEIGHT}
      aria-hidden
      className={`${badgeImageClass} shrink-0 ${className}`}
    />
  );
}

export function GooglePlayBadgeIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src={GOOGLE_PLAY_BADGE_SRC}
      alt=""
      width={GOOGLE_PLAY_BADGE_WIDTH}
      height={GOOGLE_PLAY_BADGE_HEIGHT}
      aria-hidden
      className={`${badgeImageClass} shrink-0 ${className}`}
    />
  );
}
