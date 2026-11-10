import { AppStoreBadge, GooglePlayBadge } from "@/components/store/StoreBadges";
import { APP_STORE_URL, GOOGLE_PLAY_ENABLED, GOOGLE_PLAY_URL } from "@/lib/site";
import type { Platform } from "@/lib/platform";
import styles from "./SmartDownload.module.css";

type SmartDownloadProps = {
  platform: Platform;
  appStoreHref?: string;
  googlePlayHref?: string;
  /** Small reassurance line under the button or badges. */
  trust?: string;
  /** Centre on mobile, then left-align from md up. */
  alignStart?: boolean;
  className?: string;
};

/**
 * One "Download free" button pointing at the visitor's own store, with a quiet
 * link to the other store. Desktop visitors get both badges.
 */
export function SmartDownload({
  platform,
  appStoreHref = APP_STORE_URL,
  googlePlayHref = GOOGLE_PLAY_URL,
  trust,
  alignStart = false,
  className = "",
}: SmartDownloadProps) {
  const singleStore = platform === "ios" || (platform === "android" && GOOGLE_PLAY_ENABLED);
  const primaryHref = platform === "android" ? googlePlayHref : appStoreHref;
  const primaryStore = platform === "android" ? "Google Play" : "the App Store";

  return (
    <div className={`${styles.block} ${alignStart ? styles.start : ""} ${className}`}>
      {singleStore ? (
        <div className={styles.wrap}>
          <span className={styles.glow} aria-hidden="true" />
          <a
            href={primaryHref}
            className={styles.download}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.shimmer} aria-hidden="true" />
            <span className={styles.label}>Download free</span>
            <span className={styles.srOnly}> on {primaryStore}</span>
          </a>
        </div>
      ) : (
        <div className={styles.badges}>
          <AppStoreBadge href={appStoreHref} />
          <GooglePlayBadge href={googlePlayHref} />
        </div>
      )}
      {trust ? <p className={styles.trust}>{trust}</p> : null}
      {singleStore && platform === "ios" && GOOGLE_PLAY_ENABLED ? (
        <a href={googlePlayHref} className={styles.altStore} target="_blank" rel="noopener noreferrer">
          Also on Google Play
        </a>
      ) : null}
      {singleStore && platform === "android" ? (
        <a href={appStoreHref} className={styles.altStore} target="_blank" rel="noopener noreferrer">
          Also on the App Store
        </a>
      ) : null}
    </div>
  );
}
