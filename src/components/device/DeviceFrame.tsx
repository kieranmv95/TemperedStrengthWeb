"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import styles from "./DeviceFrame.module.css";

export type DeviceFrameMediaType = "video" | "image";
export type DeviceFrameShadow = "none" | "soft" | "deep";

export type DeviceFrameProps = {
  src: string;
  type?: DeviceFrameMediaType;
  poster?: string;
  alt: string;
  /** Degrees. Applied as perspective(1200px) rotateX rotateY. */
  tilt?: { x: number; y: number };
  /** Soft bronze glow behind the device. */
  glow?: boolean;
  shadow?: DeviceFrameShadow;
  /** Device width. A number is pixels. Defaults to the container width. */
  width?: number | string;
  className?: string;
};

type FrameStyle = CSSProperties & {
  "--tilt-x"?: string;
  "--tilt-y"?: string;
  "--tilt-x-n"?: number;
  "--tilt-y-n"?: number;
  "--frame-width"?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotion() {
  return null;
}

const SHADOW_CLASS: Record<DeviceFrameShadow, string> = {
  none: "",
  soft: styles.shadowSoft,
  deep: styles.shadowDeep,
};

function frameWidth(width: number | string | undefined) {
  if (width == null) return undefined;
  return typeof width === "number" ? `${width}px` : width;
}

export function DeviceFrame({
  src,
  type = "image",
  poster,
  alt,
  tilt,
  glow = false,
  shadow = "soft",
  width,
  className,
}: DeviceFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reducedMotionPref = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );
  const motionReady = reducedMotionPref !== null;
  const reducedMotion = reducedMotionPref === true;
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  const frameReady = playingSrc === src;

  useEffect(() => {
    if (type !== "video") return;
    const node = rootRef.current;
    if (!node) return;

    const syncPlayback = (visible: boolean) => {
      const video = videoRef.current;
      if (!video) return;
      if (!visible || getReducedMotion()) {
        video.pause();
        return;
      }
      if (video.src) video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) setLoaded(true);
        syncPlayback(visible);
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [type]);

  useEffect(() => {
    if (type !== "video") return;
    const video = videoRef.current;
    if (!video || !loaded) return;

    if (reducedMotion || !inView) {
      video.pause();
      return;
    }

    video.play().catch(() => {});
  }, [type, loaded, inView, reducedMotion]);

  const tiltX = tilt?.x ?? 0;
  const tiltY = tilt?.y ?? 0;
  const tilted = tiltX !== 0 || tiltY !== 0;
  const shouldLoad = loaded && !reducedMotion;
  const playVideo = motionReady && shouldLoad && inView;
  const stageClass = tilted ? `${styles.stage} ${styles.stageTilted}` : styles.stage;

  const style: FrameStyle = {};
  const resolvedWidth = frameWidth(width);
  if (resolvedWidth) style["--frame-width"] = resolvedWidth;
  if (tilt) {
    style["--tilt-x"] = `${tilt.x}deg`;
    style["--tilt-y"] = `${tilt.y}deg`;
    style["--tilt-x-n"] = tilt.x;
    style["--tilt-y-n"] = tilt.y;
  }

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
    >
      <div className={styles.layout}>
        {glow ? <div className={styles.glow} aria-hidden="true" /> : null}
        <div className={[styles.shadowWrap, SHADOW_CLASS[shadow]].filter(Boolean).join(" ")}>
          <div className={stageClass}>
            <div className={styles.buttons} aria-hidden="true">
              <div className={`${styles.button} ${styles.buttonLeft} ${styles.action}`} />
              <div className={`${styles.button} ${styles.buttonLeft} ${styles.volumeUp}`} />
              <div className={`${styles.button} ${styles.buttonLeft} ${styles.volumeDown}`} />
              <div className={`${styles.button} ${styles.buttonRight} ${styles.power}`} />
              <div className={`${styles.button} ${styles.buttonRight} ${styles.camera}`} />
            </div>
            <div className={styles.body}>
              <div className={styles.screen}>
                {type === "video" ? (
                  <>
                    {poster ? (
                      <img className={styles.media} src={poster} alt="" aria-hidden="true" />
                    ) : null}
                    <video
                      ref={(node) => {
                        videoRef.current = node;
                        if (node) node.muted = true;
                      }}
                      className={frameReady ? styles.media : `${styles.media} ${styles.pending}`}
                      src={shouldLoad ? src : undefined}
                      poster={poster}
                      width={660}
                      height={1434}
                      muted
                      loop
                      playsInline
                      preload={shouldLoad ? "metadata" : "none"}
                      autoPlay={playVideo}
                      aria-label={alt}
                      onPlaying={() => setPlayingSrc(src)}
                    />
                  </>
                ) : (
                  <img className={styles.media} src={src} alt={alt} />
                )}
                <div className={styles.glass} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
