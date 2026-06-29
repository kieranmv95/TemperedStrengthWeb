import { DAYS, TWENTY_FOUR_HOUR_CLOSE, TWENTY_FOUR_HOUR_OPEN } from "./constants";
import type { DayHours, OpeningHours, PortalLink, VenueAddress } from "./types";

export const MAX_ENTITY_LINKS = 10;

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateLink(label: string, url: string): PortalLink {
  const trimmedLabel = label.trim();
  const normalizedUrl = normalizeUrl(url);

  if (!trimmedLabel) {
    throw new Error("Please enter a label for this link (e.g. Website or Instagram).");
  }

  if (!normalizedUrl) {
    throw new Error("Please enter a web address.");
  }

  if (!isValidUrl(normalizedUrl)) {
    throw new Error(
      "Please enter a valid web address (e.g. yoursite.com or https://yoursite.com)."
    );
  }

  return { label: trimmedLabel, url: normalizedUrl };
}

export function parseLinks(formData: FormData): PortalLink[] {
  const labels = formData.getAll("link_label");
  const urls = formData.getAll("link_url");
  const links: PortalLink[] = [];

  for (let i = 0; i < labels.length; i++) {
    const label = String(labels[i] ?? "");
    const url = String(urls[i] ?? "");
    if (!label.trim() && !url.trim()) continue;
    links.push(validateLink(label, url));
  }

  if (links.length > MAX_ENTITY_LINKS) {
    throw new Error(`You can add up to ${MAX_ENTITY_LINKS} links.`);
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

    const openRaw = String(formData.get(`${key}_open`) ?? "").trim();
    const closeRaw = String(formData.get(`${key}_close`) ?? "").trim();
    if (!openRaw || !closeRaw) {
      throw new Error(`Please set opening and closing times for ${key}, or mark it closed.`);
    }

    let open: string;
    let close: string;
    try {
      open = normalizeOpeningTime(openRaw);
      close = normalizeOpeningTime(closeRaw);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid time.";
      throw new Error(`${key}: ${message}`);
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

export function is24HourDay(day: DayHours): boolean {
  if ("closed" in day) return false;
  return (
    day.open === TWENTY_FOUR_HOUR_OPEN &&
    (day.close === TWENTY_FOUR_HOUR_CLOSE || day.close === "24:00")
  );
}

export function dayHoursToEditorState(day: DayHours | undefined): {
  closed: boolean;
  twentyFour: boolean;
  open: string;
  close: string;
} {
  const fallback = day ?? { open: "06:00", close: "22:00" };
  const parsed = defaultDayHours(fallback);

  if (parsed.closed) {
    return { closed: true, twentyFour: false, open: "06:00", close: "22:00" };
  }

  const twentyFour = is24HourDay(fallback);
  return {
    closed: false,
    twentyFour,
    open: parsed.open,
    close: twentyFour ? TWENTY_FOUR_HOUR_CLOSE : parsed.close,
  };
}

export function normalizeOpeningTime(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error(`"${value}" is not a valid time. Use HH:MM, e.g. 15:45.`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`"${value}" is not a valid time. Hours must be 00–23 and minutes 00–59.`);
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
  const manual = formData.get("address_manual") === "on";
  const line1 = String(formData.get("address_line1") ?? "").trim();
  const line2 = String(formData.get("address_line2") ?? "").trim();
  const city = String(formData.get("address_city") ?? "").trim();
  const county = String(formData.get("address_county") ?? "").trim();
  const postcode = String(formData.get("address_postcode") ?? "").trim();
  const country = String(formData.get("address_country") ?? "GB").trim() || "GB";

  if (!postcode) {
    throw new Error("Postcode is required.");
  }
  if (!city) {
    throw new Error(
      manual
        ? "City is required."
        : "Look up your postcode or enter your address manually."
    );
  }
  if (!line1) {
    throw new Error(
      manual
        ? "Street address is required."
        : "Enter your building number and street after looking up your postcode."
    );
  }
  if (line1.length > 200) {
    throw new Error("Address line 1 must be 200 characters or fewer.");
  }
  if (postcode.length > 20) {
    throw new Error("Postcode must be 20 characters or fewer.");
  }

  const latitude = parseOptionalCoordinate(formData.get("address_latitude"));
  const longitude = parseOptionalCoordinate(formData.get("address_longitude"));

  if (!manual && latitude == null && longitude == null) {
    throw new Error("Look up your postcode before saving, or use manual entry.");
  }

  return {
    line1,
    line2: line2 || null,
    city,
    county: county || null,
    postcode: postcode.toUpperCase(),
    country,
    latitude,
    longitude,
  };
}

function parseOptionalCoordinate(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isAddressComplete(address: VenueAddress): boolean {
  return Boolean(
    address.postcode?.trim() && address.city?.trim() && address.line1?.trim()
  );
}

export function parseHideLocation(formData: FormData): boolean {
  return formData.get("hide_location") === "on";
}

export function parseHasOpeningHours(formData: FormData): boolean {
  return formData.get("has_opening_hours") === "on";
}

export function addressUsesManualEntry(address: VenueAddress): boolean {
  const hasStreet =
    Boolean(address.line1?.trim()) && address.line1.trim() !== address.city.trim();
  return Boolean(address.line2?.trim()) || hasStreet;
}

export function formatPostcodeSummary(address: VenueAddress): string {
  const parts = [address.city, address.county, address.postcode].filter(Boolean);
  return parts.join(" · ");
}

/** Single-line address for display or fallback geocoding. */
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

export const MAX_TAG_LIST_ITEMS = MAX_SPECIALTIES;
export const MAX_TAG_LENGTH = MAX_SPECIALTY_LENGTH;

type TagListOptions = {
  maxItems: number;
  maxLength: number;
  itemLabel: string;
  itemLabelPlural?: string;
};

export function normalizeTagList(
  tags: string[],
  { maxItems, maxLength, itemLabel, itemLabelPlural }: TagListOptions
): string[] {
  const unique: string[] = [];

  for (const raw of tags) {
    const tag = raw.trim();
    if (!tag) continue;

    if (tag.length > maxLength) {
      throw new Error(
        `Each ${itemLabel} must be ${maxLength} characters or fewer.`
      );
    }

    const key = tag.toLowerCase();
    if (!unique.some((existing) => existing.toLowerCase() === key)) {
      unique.push(tag);
    }
  }

  if (unique.length > maxItems) {
    throw new Error(
      `You can add up to ${maxItems} ${itemLabelPlural ?? `${itemLabel}s`}.`
    );
  }

  return unique;
}

function parseTagListFromForm(
  formData: FormData,
  fieldName: string,
  options: TagListOptions
): string[] {
  const raw = formData
    .getAll(fieldName)
    .map((value) => String(value).trim())
    .filter(Boolean);

  return normalizeTagList(raw, options);
}

export function parseSpecialtiesFromForm(formData: FormData): string[] {
  return parseTagListFromForm(formData, "specialties", {
    maxItems: MAX_SPECIALTIES,
    maxLength: MAX_SPECIALTY_LENGTH,
    itemLabel: "specialty",
    itemLabelPlural: "specialties",
  });
}

export function parseFocusAreasFromForm(formData: FormData): string[] {
  return parseTagListFromForm(formData, "focus_areas", {
    maxItems: MAX_SPECIALTIES,
    maxLength: MAX_SPECIALTY_LENGTH,
    itemLabel: "focus area",
    itemLabelPlural: "focus areas",
  });
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
