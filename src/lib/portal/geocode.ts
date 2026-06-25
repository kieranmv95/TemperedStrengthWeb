import type { VenueAddress } from "./types";

const POSTCODES_IO_BASE = "https://api.postcodes.io";

type PostcodesIoResult = {
  postcode: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  admin_district: string;
  admin_county: string | null;
};

type PostcodesIoResponse = {
  status: number;
  result: PostcodesIoResult | null;
};

export class PostcodeNotFoundError extends Error {
  constructor(postcode: string) {
    super(`Postcode not found: ${postcode}`);
    this.name = "PostcodeNotFoundError";
  }
}

export function normalizePostcodeForLookup(postcode: string): string {
  return postcode.replace(/\s+/g, "").toUpperCase();
}

export function isUkAddress(country: string): boolean {
  const normalized = country.trim().toUpperCase();
  return (
    normalized === "GB" ||
    normalized === "UK" ||
    normalized === "UNITED KINGDOM" ||
    normalized === "ENGLAND" ||
    normalized === "SCOTLAND" ||
    normalized === "WALES" ||
    normalized === "NORTHERN IRELAND"
  );
}

export async function lookupUkPostcode(
  postcode: string
): Promise<PostcodesIoResult> {
  const normalized = normalizePostcodeForLookup(postcode);
  if (!normalized) {
    throw new PostcodeNotFoundError(postcode);
  }

  const response = await fetch(
    `${POSTCODES_IO_BASE}/postcodes/${encodeURIComponent(normalized)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new PostcodeNotFoundError(postcode);
    }
    throw new Error(`Postcode lookup failed (${response.status}).`);
  }

  const body = (await response.json()) as PostcodesIoResponse;
  if (!body.result) {
    throw new PostcodeNotFoundError(postcode);
  }

  return body.result;
}

export type PostcodeLookupDetails = {
  postcode: string;
  city: string;
  county: string | null;
  latitude: number;
  longitude: number;
};

export function mapPostcodeResult(result: PostcodesIoResult): PostcodeLookupDetails {
  return {
    postcode: result.postcode,
    city: result.admin_district || result.region,
    county: result.admin_county || result.region || null,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function lookupPostcodeDetails(
  postcode: string,
  country: string
): Promise<PostcodeLookupDetails> {
  if (!isUkAddress(country)) {
    throw new Error("Postcode lookup is only available for UK addresses.");
  }

  const result = await lookupUkPostcode(postcode);
  return mapPostcodeResult(result);
}

/** Resolve UK postcode to coordinates and enrich empty location fields. */
export async function enrichVenueAddress(
  address: VenueAddress
): Promise<VenueAddress> {
  if (!isUkAddress(address.country)) {
    return address;
  }

  try {
    const result = await lookupUkPostcode(address.postcode);
    const details = mapPostcodeResult(result);

    return {
      ...address,
      postcode: details.postcode,
      city: address.city.trim() || details.city,
      county: address.county?.trim() || details.county,
      latitude: details.latitude,
      longitude: details.longitude,
    };
  } catch (err) {
    if (err instanceof PostcodeNotFoundError) {
      throw new Error(
        "We couldn't find that UK postcode. Please check it and try again."
      );
    }

    // If postcodes.io is unavailable, save the address without coordinates.
    return address;
  }
}
