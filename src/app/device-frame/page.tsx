import type { Metadata } from "next";
import { DeviceFrame } from "@/components/device/DeviceFrame";

export const metadata: Metadata = {
  title: "Device frame",
  robots: { index: false, follow: false },
};

const still = {
  src: "/gyms/steeleworks.jpg",
  alt: "Athletes standing outside Steele Works",
};

export default function DeviceFramePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFBA6F]">
          Device frame
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
          Flat, tilted, and small.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
          Graphite shell on the site background. The large phone plays a silent
          video while it is on screen. The other two show a still.
        </p>

        <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-14 gap-y-20">
          <li className="w-[min(100%,360px)]">
            <figure className="flex flex-col items-center">
              <DeviceFrame
                type="video"
                src="/BG.mp4"
                poster={still.src}
                alt="Gym floor video, playing while this phone is on screen"
                width="100%"
                shadow="soft"
              />
              <figcaption className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Flat · video · soft shadow
              </figcaption>
            </figure>
          </li>

          <li className="w-[min(100%,300px)]">
            <figure className="flex flex-col items-center">
              <DeviceFrame
                type="image"
                src={still.src}
                alt={still.alt}
                width="100%"
                tilt={{ x: 14, y: -22 }}
                glow
                shadow="deep"
              />
              <figcaption className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Tilted · image · glow
              </figcaption>
            </figure>
          </li>

          <li>
            <figure className="flex flex-col items-center">
              <DeviceFrame
                type="image"
                src={still.src}
                alt={still.alt}
                width={148}
                shadow="soft"
              />
              <figcaption className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Small · 148px
              </figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </main>
  );
}
