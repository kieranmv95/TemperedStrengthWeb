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

/** Exact map pin — stored in map_marker jsonb on gyms/clubs/coaches. */
export type MapMarker = {
  latitude: number;
  longitude: number;
};

/** Structured venue address — stored as jsonb on gyms/clubs/coaches. */
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
  email: string | null;
  phone: string | null;
  links: PortalLink[];
  image_path: string | null;
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
  map_marker: MapMarker | null;
  focus_areas: string[];
  video_id: string | null;
  /** Admin-managed image URL for the app (set in Supabase). */
  gym_image_url: string | null;
};

export type Club = PortalEntityBase & {
  opening_hours: OpeningHours;
  has_opening_hours: boolean;
  address: VenueAddress;
  map_marker: MapMarker | null;
  hide_location: boolean;
};

export type Coach = PortalEntityBase & {
  address: VenueAddress;
  map_marker: MapMarker | null;
  specialties: string[];
  radius_served_km: number | null;
  hide_location: boolean;
};

export type PortalEntity = Gym | Club | Coach;

export type PortalProfile = {
  id: string;
  display_name: string | null;
  created_at: string;
};
