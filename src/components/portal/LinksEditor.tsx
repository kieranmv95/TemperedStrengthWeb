"use client";

import type { PortalLink } from "@/lib/portal/types";

type Props = {
  links: PortalLink[];
};

export function LinksEditor({ links }: Props) {
  const rows =
    links.length > 0
      ? [...links, { label: "", url: "" }]
      : [
          { label: "", url: "" },
          { label: "", url: "" },
          { label: "", url: "" },
        ];

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-white">Links</legend>
      <p className="text-sm text-neutral-500">
        Website, Instagram, booking page, or other useful links.
      </p>
      <div className="space-y-3">
        {rows.map((link, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">
                Label
              </span>
              <input
                type="text"
                name="link_label"
                defaultValue={link.label}
                placeholder="Website"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">
                URL
              </span>
              <input
                type="url"
                name="link_url"
                defaultValue={link.url}
                placeholder="https://"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
              />
            </label>
          </div>
        ))}
        <p className="text-xs text-neutral-600">
          Leave both fields blank on the last row to skip a link.
        </p>
      </div>
    </fieldset>
  );
}
