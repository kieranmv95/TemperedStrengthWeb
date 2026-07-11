import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { partnerAssets } from "@/data/partnerAssets";

export const metadata: Metadata = {
  title: "Partner Assets | Tempered Strength",
  description:
    "Download official Tempered Strength logos and brand assets for partner designs, mockups, and marketing.",
};

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function downloadFilename(fileUrl: string) {
  return fileUrl.split("/").pop() ?? "asset";
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <header className="flex justify-center mb-10">
          <Link href="/">
            <Image
              src="/logo_stacked.svg"
              alt="Tempered Strength"
              width={140}
              height={40}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
        </header>

        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#c9b072] font-medium mb-3">
            Brand resources
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Partner Assets
          </h1>
          <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Download official Tempered Strength logos for your designs, mockups,
            and partner marketing. Use on light or dark backgrounds as indicated.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {partnerAssets.map((asset) => {
            const filename = downloadFilename(asset.fileUrl);

            return (
              <li
                key={asset.fileUrl}
                className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
              >
                <div
                  className="relative flex items-center justify-center h-44 md:h-52 p-8 border-b border-neutral-800"
                  style={{ backgroundColor: asset.bg }}
                >
                  <Image
                    src={asset.fileUrl}
                    alt={asset.title}
                    width={280}
                    height={80}
                    className="max-h-20 md:max-h-24 w-auto object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                  <div className="flex-1">
                    <h2 className="font-semibold text-white">{asset.title}</h2>
                    <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
                      {asset.description}
                    </p>
                  </div>

                  <a
                    href={asset.fileUrl}
                    download={filename}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#c9b072]/35 bg-[#c9b072]/10 px-4 py-2.5 text-sm font-semibold text-[#c9b072] transition-colors hover:border-[#c9b072]/60 hover:bg-[#c9b072]/20"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download {filename}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-center text-sm text-neutral-500 mt-10 max-w-lg mx-auto leading-relaxed">
          Please use these assets as provided and do not alter the logo colours
          or proportions. Questions?{" "}
          <a
            href="mailto:contact@localhostdevelopment.com"
            className="text-[#c9b072] hover:underline"
          >
            Get in touch
          </a>
          .
        </p>

        <footer className="text-sm text-neutral-600 pt-10 mt-12 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} LOCALHOSTDEVELOPMENT LTD</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="hover:text-[#c9b072] transition-colors">
                Home
              </Link>
              <Link href="/links" className="hover:text-[#c9b072] transition-colors">
                Links
              </Link>
              <Link href="/portal/login" className="hover:text-[#c9b072] transition-colors">
                Partner portal
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
