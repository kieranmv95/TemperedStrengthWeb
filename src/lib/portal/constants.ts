import type { DayKey, PortalEntityKind } from "./types";

export const DAYS: { key: DayKey; label: string; shortLabel: string }[] = [
  { key: "monday", label: "Monday", shortLabel: "Mon" },
  { key: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { key: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { key: "thursday", label: "Thursday", shortLabel: "Thu" },
  { key: "friday", label: "Friday", shortLabel: "Fri" },
  { key: "saturday", label: "Saturday", shortLabel: "Sat" },
  { key: "sunday", label: "Sunday", shortLabel: "Sun" },
];

export const TWENTY_FOUR_HOUR_OPEN = "00:00";
export const TWENTY_FOUR_HOUR_CLOSE = "23:59";

export type EntityConfig = {
  kind: PortalEntityKind;
  table: PortalEntityKind;
  label: string;
  plural: string;
  singular: string;
  description: string;
  hasOpeningHours: boolean;
  hasAddress: boolean;
  canHideLocation: boolean;
};

export const ENTITY_CONFIGS: Record<PortalEntityKind, EntityConfig> = {
  gyms: {
    kind: "gyms",
    table: "gyms",
    label: "Gym",
    plural: "Gyms",
    singular: "gym",
    description: "Manage your gym profile and partner dashboard.",
    hasOpeningHours: true,
    hasAddress: true,
    canHideLocation: false,
  },
  clubs: {
    kind: "clubs",
    table: "clubs",
    label: "Club",
    plural: "Clubs",
    singular: "club",
    description: "Manage your club profile and partner dashboard.",
    hasOpeningHours: true,
    hasAddress: true,
    canHideLocation: true,
  },
  coaches: {
    kind: "coaches",
    table: "coaches",
    label: "Coach",
    plural: "Coaches",
    singular: "coach",
    description: "Manage your coaching profile and partner dashboard.",
    hasOpeningHours: false,
    hasAddress: true,
    canHideLocation: true,
  },
};

export function isPortalEntityKind(value: string): value is PortalEntityKind {
  return value === "gyms" || value === "clubs" || value === "coaches";
}
