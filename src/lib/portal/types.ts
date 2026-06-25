export type PortalEntityStatus = "draft" | "pending" | "approved" | "rejected";

export type PortalEntityKind = "gyms" | "clubs" | "coaches";

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayHours = { open: string; close: string } | { closed: true };

export type OpeningHours = Record<DayKey, DayHours>;

export type PortalLink = { label: string; url: string };

/** Structured venue address — stored as jsonb on gyms/clubs. */
export type VenueAddress = {
  line1: string;
  line2?: string | null;
  city: string;
  county?: string | null;
  postcode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type PortalEntityBase = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  links: PortalLink[];
  status: PortalEntityStatus;
  rejection_note: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Gym = PortalEntityBase & {
  opening_hours: OpeningHours;
  address: VenueAddress;
};

export type Club = PortalEntityBase & {
  opening_hours: OpeningHours;
  address: VenueAddress;
};

export type Coach = PortalEntityBase & {
  address: VenueAddress;
};

export type PortalEntity = Gym | Club | Coach;

export type PortalProfile = {
  id: string;
  display_name: string | null;
  created_at: string;
};
