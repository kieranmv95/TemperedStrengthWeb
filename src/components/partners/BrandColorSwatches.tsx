"use client";

import { useEffect, useState } from "react";
import { brandColors } from "@/data/partnerAssets";

function copyWithExecCommand(hex: string) {
  const input = document.createElement("textarea");
  input.value = hex;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(input);
  if (!copied) {
    throw new Error("Copy failed");
  }
}

async function writeClipboard(hex: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(hex);
      return;
    } catch {
      copyWithExecCommand(hex);
      return;
    }
  }

  copyWithExecCommand(hex);
}

export function BrandColorSwatches() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedHex) return;
    const id = window.setTimeout(() => setCopiedHex(null), 1600);
    return () => window.clearTimeout(id);
  }, [copiedHex]);

  async function copyHex(hex: string) {
    try {
      await writeClipboard(hex);
      setCopiedHex(hex);
    } catch {
      setCopiedHex(null);
    }
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {brandColors.map((color) => {
        const copied = copiedHex === color.hex;

        return (
          <li key={color.hex}>
            <button
              type="button"
              onClick={() => copyHex(color.hex)}
              aria-label={
                copied
                  ? `Copied ${color.name} ${color.hex}`
                  : `Copy ${color.name} ${color.hex}`
              }
              className="flex w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 text-left transition-colors hover:border-[#FFBA6F]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFBA6F]"
            >
              <span
                className="block h-24 border-b border-black/20"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <span className="flex flex-col gap-1 p-4">
                <span className="text-sm font-semibold text-white">
                  {color.name}
                </span>
                <span className="font-mono text-sm text-[#FFBA6F]" aria-live="polite">
                  {copied ? "Copied" : color.hex}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
