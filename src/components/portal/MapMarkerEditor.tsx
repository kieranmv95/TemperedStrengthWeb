"use client";

import { useState } from "react";
import type { MapMarker } from "@/lib/portal/types";

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none tabular-nums";

type Props = {
  mapMarker?: MapMarker | null;
};

export function MapMarkerEditor({ mapMarker }: Props) {
  const [latitude, setLatitude] = useState(
    mapMarker?.latitude != null ? String(mapMarker.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    mapMarker?.longitude != null ? String(mapMarker.longitude) : ""
  );
  const [showHelp, setShowHelp] = useState(false);

  return (
    <fieldset className="min-w-0 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <legend className="text-sm font-semibold text-white">Map marker</legend>
          <p className="mt-0.5 text-xs text-neutral-500">
            Optional. The exact point shown on the map in the app. If you leave
            this blank, we use your address postcode as a fallback — that is less
            accurate and may be hundreds of metres from your entrance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp((open) => !open)}
          className="shrink-0 text-xs font-medium text-[#c9b072] hover:underline"
          aria-expanded={showHelp}
        >
          {showHelp ? "Hide help" : "How do I find these?"}
        </button>
      </div>

      {showHelp ? (
        <div className="rounded-md border border-[#c9b072]/25 bg-[#c9b072]/5 p-3 text-xs leading-relaxed text-neutral-300">
          <p className="font-semibold text-white">Google Maps (desktop)</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4">
            <li>Open Google Maps and find your venue.</li>
            <li>Right-click the exact spot for your entrance.</li>
            <li>
              Click the coordinates at the top of the menu — they copy to your
              clipboard (e.g. <span className="tabular-nums">53.4839, -2.2935</span>
              ).
            </li>
            <li>Paste the first number into Latitude and the second into Longitude.</li>
          </ol>
          <p className="mt-3 font-semibold text-white">Google Maps (phone)</p>
          <p className="mt-1">
            Press and hold on the map at your entrance, then check the
            coordinates shown at the bottom of the screen.
          </p>
          <p className="mt-3 text-neutral-400">
            Use decimal degrees (e.g. latitude{" "}
            <span className="tabular-nums text-neutral-300">53.4839</span>, longitude{" "}
            <span className="tabular-nums text-neutral-300">-2.2935</span>). UK
            latitudes are usually around 50–60; longitudes are negative (west of
            Greenwich).
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Latitude
          </span>
          <input
            type="text"
            name="map_latitude"
            inputMode="decimal"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g. 53.4839"
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Longitude
          </span>
          <input
            type="text"
            name="map_longitude"
            inputMode="decimal"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g. -2.2935"
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      </div>

      {!latitude.trim() && !longitude.trim() ? (
        <p className="text-xs text-neutral-500">
          No map marker set — the app will fall back to your address postcode.
        </p>
      ) : (
        <p className="text-xs text-emerald-300/90">
          Exact map marker will be used in the app.
        </p>
      )}
    </fieldset>
  );
}
