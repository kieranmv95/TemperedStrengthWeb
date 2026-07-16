"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/site";

type Props = {
  className?: string;
};

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/programs", label: "Programs" },
  { href: "/articles", label: "Articles" },
  { href: "/patch-notes", label: "Patch notes" },
  { href: "/portal/login", label: "Partner login" },
] as const;

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function SiteHeader({ className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogLabelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const overlay = (
    <div className="md:hidden fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogLabelId}
        className="absolute top-4 left-4 right-4 rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <p
            id={dialogLabelId}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500"
          >
            Navigate
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 p-2 text-white hover:bg-neutral-900/80"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile primary" className="grid gap-2">
          <Link
            href="/"
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900/70"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900/70"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900/70"
            onClick={() => setOpen(false)}
          >
            <InstagramGlyph className="h-4 w-4" />
            Instagram
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900/70"
            onClick={() => setOpen(false)}
          >
            <YouTubeGlyph className="h-4 w-4" />
            YouTube
          </a>
        </nav>
      </div>
    </div>
  );

  return (
    <header className={`relative ${className}`}>
      <div className="relative flex items-center justify-end md:justify-between gap-3">
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center md:static md:translate-x-0"
        >
          <Image
            src="/logo_stacked.svg"
            alt="Tempered Strength"
            width={190}
            height={53}
            priority
            className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity md:h-14"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-300"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on Instagram"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 p-2 text-neutral-300 hover:text-white hover:border-[#c9b072]/40 hover:bg-[#c9b072]/5 transition-colors"
          >
            <InstagramGlyph className="h-4 w-4" />
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Subscribe on YouTube"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 p-2 text-neutral-300 hover:text-white hover:border-[#c9b072]/40 hover:bg-[#c9b072]/5 transition-colors"
          >
            <YouTubeGlyph className="h-4 w-4" />
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-900/70"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mounted && open ? createPortal(overlay, document.body) : null}
    </header>
  );
}
