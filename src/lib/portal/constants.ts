import type { DayKey, PortalEntityKind } from "./types";

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export type EntityConfig = {
  kind: PortalEntityKind;
  table: PortalEntityKind;
  label: string;
  plural: string;
  singular: string;
  description: string;
  hasOpeningHours: boolean;
  hasAddress: boolean;
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
  },
};

export function isPortalEntityKind(value: string): value is PortalEntityKind {
  return value === "gyms" || value === "clubs" || value === "coaches";
}
