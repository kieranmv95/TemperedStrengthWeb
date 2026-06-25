import type {
  Club,
  Coach,
  Gym,
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
  latitude: number | null;
  longitude: number | null;
};

export type PublicLink = PortalLink;

type PublicListingBase = {
  id: string;
  name: string;
  description: string | null;
  address: PublicVenueAddress;
  links: PublicLink[];
  approvedAt: string | null;
  updatedAt: string;
};

export type PublicGymListing = PublicListingBase & {
  openingHours: OpeningHours;
};

export type PublicClubListing = PublicListingBase & {
  openingHours: OpeningHours;
};

export type PublicCoachListing = PublicListingBase;

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

function toPublicListingBase(
  entity: Gym | Club | Coach
): PublicListingBase {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    address: toPublicAddress(entity.address),
    links: entity.links,
    approvedAt: entity.approved_at,
    updatedAt: entity.updated_at,
  };
}

export function toPublicGym(gym: Gym): PublicGymListing {
  return {
    ...toPublicListingBase(gym),
    openingHours: gym.opening_hours,
  };
}

export function toPublicClub(club: Club): PublicClubListing {
  return {
    ...toPublicListingBase(club),
    openingHours: club.opening_hours,
  };
}

export function toPublicCoach(coach: Coach): PublicCoachListing {
  return toPublicListingBase(coach);
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
