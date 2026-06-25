"use client";

import { useState } from "react";
import { OpeningHoursEditor } from "@/components/portal/OpeningHoursEditor";
import type { OpeningHours } from "@/lib/portal/types";

type Props = {
  openingHours: OpeningHours;
  hasOpeningHours?: boolean;
};

export function ClubOpeningHoursSection({
  openingHours,
  hasOpeningHours: initialHasOpeningHours = true,
}: Props) {
  const [hasOpeningHours, setHasOpeningHours] = useState(initialHasOpeningHours);

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2 rounded-lg border border-neutral-800/80 bg-neutral-950/40 px-3 py-2.5">
        <input
          type="checkbox"
          checked={!hasOpeningHours}
          onChange={(e) => setHasOpeningHours(!e.target.checked)}
          className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/50"
        />
        <span className="text-xs text-neutral-400">
          No fixed opening hours — we won&apos;t show a schedule in the app (e.g.
          session times vary or are arranged directly with members).
        </span>
      </label>

      <input
        type="hidden"
        name="has_opening_hours"
        value={hasOpeningHours ? "on" : "off"}
      />

      {hasOpeningHours ? <OpeningHoursEditor openingHours={openingHours} /> : null}
    </div>
  );
}
