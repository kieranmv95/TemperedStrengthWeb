import type {
  Club,
  Coach,
  Gym,
  MapMarker,
  OpeningHours,
  PortalEntityKind,
  PortalLink,
  VenueAddress,
} from "./types";
import { mapClub, mapCoach, mapGym } from "./db";
import { createAdminClient } from "@/lib/supabase/admin";

export type PublicVenueAddress = {
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  country: string;
  /** Postcode centre — fallback when mapMarker is omitted. */
  latitude: number | null;
  longitude: number | null;
};

export type PublicMapMarker = MapMarker;

export type PublicLink = PortalLink;

type PublicListingBase = {
  id: string;
  name: string;
  description: string | null;
  address: PublicVenueAddress;
  mapMarker: PublicMapMarker | null;
  links: PublicLink[];
  email: string | null;
  phone: string | null;
  approvedAt: string | null;
  updatedAt: string;
};

export type PublicGymListing = PublicListingBase & {
  openingHours: OpeningHours;
  focusAreas: string[];
  videoId: string | null;
};

export type PublicClubListing = PublicListingBase & {
  hasOpeningHours: boolean;
  openingHours?: OpeningHours;
  hideLocation: boolean;
};

export type PublicCoachListing = PublicListingBase & {
  specialties: string[];
  radiusServedKm: number | null;
  hideLocation: boolean;
};

const TABLE_BY_KIND: Record<PortalEntityKind, PortalEntityKind> = {
  gyms: "gyms",
  clubs: "clubs",
  coaches: "coaches",
};

function toPublicAddress(address: VenueAddress): PublicVenueAddress {
  return {
    line1: address.line1,
    line2: address.line2 ?? null,
    city: address.city,
    county: address.county ?? null,
    postcode: address.postcode,
    country: address.country,
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
  };
}

function redactedPublicAddress(country: string): PublicVenueAddress {
  return {
    line1: "",
    line2: null,
    city: "",
    county: null,
    postcode: "",
    country,
    latitude: null,
    longitude: null,
  };
}

function toPublicListingBase(
  entity: Gym | Club | Coach,
  options?: { hideLocation?: boolean }
): PublicListingBase {
  const hideLocation = options?.hideLocation ?? false;
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    address: hideLocation
      ? redactedPublicAddress(entity.address.country)
      : toPublicAddress(entity.address),
    mapMarker: hideLocation ? null : entity.map_marker,
    links: entity.links,
    email: entity.email,
    phone: entity.phone,
    approvedAt: entity.approved_at,
    updatedAt: entity.updated_at,
  };
}

export function toPublicGym(gym: Gym): PublicGymListing {
  return {
    ...toPublicListingBase(gym),
    openingHours: gym.opening_hours,
    focusAreas: gym.focus_areas,
    videoId: gym.video_id,
  };
}

export function toPublicClub(club: Club): PublicClubListing {
  const base = {
    ...toPublicListingBase(club, { hideLocation: club.hide_location }),
    hasOpeningHours: club.has_opening_hours,
    hideLocation: club.hide_location,
  };

  if (!club.has_opening_hours) {
    return base;
  }

  return {
    ...base,
    openingHours: club.opening_hours,
  };
}

export function toPublicCoach(coach: Coach): PublicCoachListing {
  return {
    ...toPublicListingBase(coach, { hideLocation: coach.hide_location }),
    specialties: coach.specialties,
    radiusServedKm: coach.radius_served_km,
    hideLocation: coach.hide_location,
  };
}

export async function listApprovedGyms(): Promise<PublicGymListing[]> {
  const rows = await fetchApprovedRows("gyms");
  return rows.map((row) => toPublicGym(mapGym(row)));
}

export async function listApprovedClubs(): Promise<PublicClubListing[]> {
  const rows = await fetchApprovedRows("clubs");
  return rows.map((row) => toPublicClub(mapClub(row)));
}

export async function listApprovedCoaches(): Promise<PublicCoachListing[]> {
  const rows = await fetchApprovedRows("coaches");
  return rows.map((row) => toPublicCoach(mapCoach(row)));
}

async function fetchApprovedRows(
  kind: PortalEntityKind
): Promise<Record<string, unknown>[]> {
  const supabase = createAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from(TABLE_BY_KIND[kind])
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Record<string, unknown>[];
}

export const PUBLIC_LISTING_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
};
