"use client";

import { useCallback, useState, useTransition } from "react";
import { lookupPostcode } from "@/app/portal/actions";
import { addressUsesManualEntry, formatPostcodeSummary } from "@/lib/portal/validation";
import type { VenueAddress } from "@/lib/portal/types";

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type LookupStatus = "idle" | "loading" | "verified" | "error";

type Props = {
  address: VenueAddress;
  canHideLocation?: boolean;
  hideLocation?: boolean;
};

export function AddressEditor({
  address,
  canHideLocation = false,
  hideLocation: initialHideLocation = false,
}: Props) {
  const streetFromAddress =
    address.line1.trim() && address.line1.trim() !== address.city.trim()
      ? address.line1
      : "";

  const [manualMode, setManualMode] = useState(() => addressUsesManualEntry(address));
  const [postcode, setPostcode] = useState(address.postcode);
  const [city, setCity] = useState(address.city);
  const [county, setCounty] = useState(address.county ?? "");
  const [line1, setLine1] = useState(streetFromAddress);
  const [line2, setLine2] = useState(address.line2 ?? "");
  const [postcodeLatitude, setPostcodeLatitude] = useState<number | null>(
    address.latitude ?? null
  );
  const [postcodeLongitude, setPostcodeLongitude] = useState<number | null>(
    address.longitude ?? null
  );
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>(
    address.latitude != null && address.longitude != null ? "verified" : "idle"
  );
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearPostcodeCoordinates = useCallback(() => {
    setPostcodeLatitude(null);
    setPostcodeLongitude(null);
    setLookupStatus("idle");
    setLookupMessage(null);
  }, []);

  const applyLookupResult = useCallback(
    (details: {
      postcode: string;
      city: string;
      county: string | null;
      latitude: number;
      longitude: number;
    }) => {
      setPostcode(details.postcode);
      setCity(details.city);
      if (details.county) {
        setCounty(details.county);
      }
      setPostcodeLatitude(details.latitude);
      setPostcodeLongitude(details.longitude);
      setLookupStatus("verified");
      setLookupMessage(null);
    },
    []
  );

  const runPostcodeLookup = useCallback(() => {
    const trimmed = postcode.trim();
    if (!trimmed) {
      clearPostcodeCoordinates();
      return;
    }

    setLookupStatus("loading");
    setLookupMessage(null);

    startTransition(async () => {
      const result = await lookupPostcode(trimmed, "GB");

      if (!result.ok) {
        clearPostcodeCoordinates();
        setLookupStatus("error");
        setLookupMessage(result.error);
        return;
      }

      applyLookupResult(result.details);
    });
  }, [applyLookupResult, clearPostcodeCoordinates, postcode]);

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    if (lookupStatus === "verified") {
      clearPostcodeCoordinates();
      setCity("");
      setCounty("");
      setLine1("");
      setLine2("");
    }
  };

  const switchToManual = () => {
    setManualMode(true);
    setLookupMessage(null);
  };

  const switchToPostcode = () => {
    setManualMode(false);
    setLookupMessage(null);
    if (postcode.trim()) {
      runPostcodeLookup();
    }
  };

  const isLoading = lookupStatus === "loading" || isPending;
  const summary =
    lookupStatus === "verified" && city
      ? formatPostcodeSummary({ ...address, city, county: county || null, postcode })
      : null;

  return (
    <fieldset className="min-w-0 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <legend className="text-sm font-semibold text-white">Location</legend>
          <p className="mt-0.5 text-xs text-neutral-500">
            {manualMode
              ? "Enter your full address."
              : "Enter your postcode, then add your building number and street."}
          </p>
        </div>
        <button
          type="button"
          onClick={manualMode ? switchToPostcode : switchToManual}
          className="shrink-0 text-xs font-medium text-[#c9b072] hover:underline"
        >
          {manualMode ? "Use postcode" : "Enter manually"}
        </button>
      </div>

      <input type="hidden" name="address_country" value="GB" />
      <input
        type="hidden"
        name="address_manual"
        value={manualMode ? "on" : "off"}
      />
      <input type="hidden" name="address_latitude" value={postcodeLatitude ?? ""} />
      <input type="hidden" name="address_longitude" value={postcodeLongitude ?? ""} />
      {!manualMode ? (
        <>
          <input type="hidden" name="address_city" value={city} />
          <input type="hidden" name="address_county" value={county} />
        </>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          type="text"
          name={manualMode ? undefined : "address_postcode"}
          required
          value={postcode}
          onChange={(e) => handlePostcodeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runPostcodeLookup();
            }
          }}
          placeholder="Postcode"
          className={`min-w-0 flex-1 ${inputClass}`}
          autoComplete="postal-code"
        />
        {!manualMode ? (
          <button
            type="button"
            onClick={runPostcodeLookup}
            disabled={isLoading || !postcode.trim()}
            className="shrink-0 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#c9b072]/40 disabled:opacity-40 sm:self-stretch"
          >
            {isLoading ? "…" : "Look up"}
          </button>
        ) : null}
      </div>

      {manualMode ? (
        <input type="hidden" name="address_postcode" value={postcode} />
      ) : null}

      {isLoading ? (
        <p className="text-xs text-neutral-500">Looking up postcode…</p>
      ) : null}

      {lookupMessage ? (
        <p className="text-xs text-red-300">{lookupMessage}</p>
      ) : null}

      {summary && !manualMode ? (
        <p className="text-xs text-emerald-300/90">{summary}</p>
      ) : null}

      {!manualMode && lookupStatus === "verified" ? (
        <div className="space-y-2 border-t border-neutral-800/80 pt-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-400">
              Building number and street <span className="text-[#c9b072]">*</span>
            </span>
            <input
              type="text"
              name="address_line1"
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="e.g. 42 High Street"
              className={inputClass}
              autoComplete="address-line1"
            />
          </label>
          <input
            type="text"
            name="address_line2"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Flat, unit, etc. (optional)"
            className={inputClass}
            autoComplete="address-line2"
          />
        </div>
      ) : null}

      {manualMode ? (
        <div className="space-y-2 border-t border-neutral-800/80 pt-2">
          <input
            type="text"
            name="address_line1"
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="Street address"
            className={inputClass}
          />
          <input
            type="text"
            name="address_line2"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Line 2 (optional)"
            className={inputClass}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="text"
              name="address_city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={inputClass}
            />
            <input
              type="text"
              name="address_county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="County (optional)"
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {canHideLocation ? (
        <label className="flex items-start gap-2 border-t border-neutral-800/80 pt-2">
          <input
            type="checkbox"
            name="hide_location"
            defaultChecked={initialHideLocation}
            className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/50"
          />
          <span className="text-xs text-neutral-400">
            Hide location from the app. Use this if the address is only for our
            records and isn&apos;t where members meet you.
          </span>
        </label>
      ) : null}
    </fieldset>
  );
}
