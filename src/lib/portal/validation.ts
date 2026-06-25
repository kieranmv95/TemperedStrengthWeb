import { DAYS } from "./constants";
import type { DayHours, OpeningHours, PortalLink, VenueAddress } from "./types";

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseLinks(formData: FormData): PortalLink[] {
  const labels = formData.getAll("link_label");
  const urls = formData.getAll("link_url");
  const links: PortalLink[] = [];

  for (let i = 0; i < labels.length; i++) {
    const label = String(labels[i] ?? "").trim();
    const url = String(urls[i] ?? "").trim();
    if (!label && !url) continue;
    if (!label || !url) {
      throw new Error("Each link needs both a label and a URL.");
    }
    if (!isValidUrl(url)) {
      throw new Error(`Invalid URL: ${url}`);
    }
    links.push({ label, url });
  }

  return links;
}

export function parseOpeningHours(formData: FormData): OpeningHours {
  const hours = {} as OpeningHours;

  for (const { key } of DAYS) {
    const closed = formData.get(`${key}_closed`) === "on";
    if (closed) {
      hours[key] = { closed: true };
      continue;
    }

    const open = String(formData.get(`${key}_open`) ?? "").trim();
    const close = String(formData.get(`${key}_close`) ?? "").trim();
    if (!open || !close) {
      throw new Error(`Please set opening and closing times for ${key}, or mark it closed.`);
    }
    hours[key] = { open, close };
  }

  return hours;
}

export function defaultOpeningHours(): OpeningHours {
  const hours = {} as OpeningHours;
  for (const { key } of DAYS) {
    hours[key] = { open: "06:00", close: "22:00" };
  }
  return hours;
}

export function defaultDayHours(day: DayHours): { closed: boolean; open: string; close: string } {
  if ("closed" in day) {
    return { closed: true, open: "06:00", close: "22:00" };
  }
  return { closed: false, open: day.open, close: day.close };
}

export function validateEntityName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Name is required.");
  }
  if (trimmed.length > 200) {
    throw new Error("Name must be 200 characters or fewer.");
  }
  return trimmed;
}

export function validateDescription(description: string): string | null {
  const trimmed = description.trim();
  if (!trimmed) return null;
  if (trimmed.length > 5000) {
    throw new Error("Description must be 5000 characters or fewer.");
  }
  return trimmed;
}

export function defaultVenueAddress(): VenueAddress {
  return {
    line1: "",
    line2: "",
    city: "",
    county: "",
    postcode: "",
    country: "GB",
    latitude: null,
    longitude: null,
  };
}

export function parseAddressFromForm(formData: FormData): VenueAddress {
  const line1 = String(formData.get("address_line1") ?? "").trim();
  const line2 = String(formData.get("address_line2") ?? "").trim();
  const city = String(formData.get("address_city") ?? "").trim();
  const county = String(formData.get("address_county") ?? "").trim();
  const postcode = String(formData.get("address_postcode") ?? "").trim();
  const country = String(formData.get("address_country") ?? "GB").trim() || "GB";

  if (!line1) {
    throw new Error("Address line 1 is required.");
  }
  if (!city) {
    throw new Error("City is required.");
  }
  if (!postcode) {
    throw new Error("Postcode is required.");
  }
  if (line1.length > 200) {
    throw new Error("Address line 1 must be 200 characters or fewer.");
  }
  if (postcode.length > 20) {
    throw new Error("Postcode must be 20 characters or fewer.");
  }

  return {
    line1,
    line2: line2 || null,
    city,
    county: county || null,
    postcode: postcode.toUpperCase(),
    country,
    latitude: null,
    longitude: null,
  };
}

export function isAddressComplete(address: VenueAddress): boolean {
  return Boolean(address.line1?.trim() && address.city?.trim() && address.postcode?.trim());
}

/** Single-line address for geocoding APIs (e.g. Nominatim) later. */
export function formatAddressForGeocoding(address: VenueAddress): string {
  return [
    address.line1,
    address.line2,
    address.city,
    address.county,
    address.postcode,
    address.country === "GB" ? "United Kingdom" : address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function formatAddressDisplay(address: VenueAddress): string {
  return formatAddressForGeocoding(address);
}

const MAX_SPECIALTIES = 20;
const MAX_SPECIALTY_LENGTH = 50;

export function parseSpecialtiesFromForm(formData: FormData): string[] {
  const raw = String(formData.get("specialties") ?? "").trim();
  if (!raw) return [];

  const specialties = raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const specialty of specialties) {
    if (specialty.length > MAX_SPECIALTY_LENGTH) {
      throw new Error(
        `Each specialty must be ${MAX_SPECIALTY_LENGTH} characters or fewer.`
      );
    }
    const key = specialty.toLowerCase();
    if (!unique.some((existing) => existing.toLowerCase() === key)) {
      unique.push(specialty);
    }
  }

  if (unique.length > MAX_SPECIALTIES) {
    throw new Error(`You can add up to ${MAX_SPECIALTIES} specialties.`);
  }

  return unique;
}

export function parseRadiusServedKm(formData: FormData): number | null {
  const raw = String(formData.get("radius_served_km") ?? "").trim();
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Service radius must be a positive number.");
  }
  if (value > 500) {
    throw new Error("Service radius must be 500 km or fewer.");
  }

  return Math.round(value * 10) / 10;
}

export function formatSpecialtiesForForm(specialties: string[]): string {
  return specialties.join(", ");
}
