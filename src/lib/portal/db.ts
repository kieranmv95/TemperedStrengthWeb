import type {
  Club,
  Coach,
  Gym,
  OpeningHours,
  PortalEntityKind,
  PortalLink,
  VenueAddress,
} from "./types";
import { defaultVenueAddress, isAddressComplete } from "./validation";

export function parseLinks(value: unknown): PortalLink[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is PortalLink =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as PortalLink).label === "string" &&
      typeof (item as PortalLink).url === "string"
  );
}

export function parseSpecialties(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseOpeningHours(value: unknown): OpeningHours {
  if (!value || typeof value !== "object") {
    return {} as OpeningHours;
  }
  return value as OpeningHours;
}

export function parseAddressFromRow(value: unknown, legacyLocation?: unknown): VenueAddress {
  if (!value || typeof value !== "object") {
    if (typeof legacyLocation === "string" && legacyLocation.trim()) {
      return {
        ...defaultVenueAddress(),
        line1: legacyLocation.trim(),
      };
    }
    return defaultVenueAddress();
  }

  const raw = value as Record<string, unknown>;
  const address: VenueAddress = {
    line1: typeof raw.line1 === "string" ? raw.line1 : "",
    line2: typeof raw.line2 === "string" ? raw.line2 : null,
    city: typeof raw.city === "string" ? raw.city : "",
    county: typeof raw.county === "string" ? raw.county : null,
    postcode: typeof raw.postcode === "string" ? raw.postcode : "",
    country: typeof raw.country === "string" ? raw.country : "GB",
    latitude: typeof raw.latitude === "number" ? raw.latitude : null,
    longitude: typeof raw.longitude === "number" ? raw.longitude : null,
  };

  if (
    !isAddressComplete(address) &&
    typeof legacyLocation === "string" &&
    legacyLocation.trim()
  ) {
    return { ...address, line1: legacyLocation.trim() };
  }

  return address;
}

export function mapGym(row: Record<string, unknown>): Gym {
  return {
    id: String(row.id),
    owner_id: String(row.owner_id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    opening_hours: parseOpeningHours(row.opening_hours),
    address: parseAddressFromRow(row.address),
    focus_areas: parseSpecialties(row.focus_areas),
    links: parseLinks(row.links),
    status: row.status as Gym["status"],
    rejection_note: row.rejection_note ? String(row.rejection_note) : null,
    submitted_at: row.submitted_at ? String(row.submitted_at) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapClub(row: Record<string, unknown>): Club {
  return {
    id: String(row.id),
    owner_id: String(row.owner_id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    opening_hours: parseOpeningHours(row.opening_hours),
    has_opening_hours: row.has_opening_hours !== false,
    address: parseAddressFromRow(row.address),
    hide_location: row.hide_location === true,
    links: parseLinks(row.links),
    status: row.status as Club["status"],
    rejection_note: row.rejection_note ? String(row.rejection_note) : null,
    submitted_at: row.submitted_at ? String(row.submitted_at) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapCoach(row: Record<string, unknown>): Coach {
  const radius = row.radius_served_km;
  return {
    id: String(row.id),
    owner_id: String(row.owner_id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    address: parseAddressFromRow(row.address, row.location),
    specialties: parseSpecialties(row.specialties),
    radius_served_km:
      typeof radius === "number" && Number.isFinite(radius) ? radius : null,
    hide_location: row.hide_location === true,
    links: parseLinks(row.links),
    status: row.status as Coach["status"],
    rejection_note: row.rejection_note ? String(row.rejection_note) : null,
    submitted_at: row.submitted_at ? String(row.submitted_at) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export type EntityRow = Gym | Club | Coach;

export function mapEntity(
  kind: PortalEntityKind,
  row: Record<string, unknown>
): EntityRow {
  if (kind === "gyms") return mapGym(row);
  if (kind === "clubs") return mapClub(row);
  return mapCoach(row);
}
