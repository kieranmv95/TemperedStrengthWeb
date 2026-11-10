import styles from "./Atmosphere.module.css";

type AtmosphereProps = {
  className?: string;
  /** Stronger glow for small canvases, such as the link-in-bio header. */
  tone?: "soft" | "focus";
};

/** Two slow-drifting bronze blobs. Sits behind a section's content. */
export function Atmosphere({ className = "", tone = "soft" }: AtmosphereProps) {
  const toneClass = tone === "focus" ? styles.focus : "";
  return (
    <div className={`${styles.atmosphere} ${toneClass} ${className}`} aria-hidden>
      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />
    </div>
  );
}
