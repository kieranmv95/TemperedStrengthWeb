import { AddressEditor } from "@/components/portal/AddressEditor";
import { ClubOpeningHoursSection } from "@/components/portal/ClubOpeningHoursSection";
import { CoachFieldsEditor } from "@/components/portal/CoachFieldsEditor";
import { GymFieldsEditor } from "@/components/portal/GymFieldsEditor";
import { LinksEditor } from "@/components/portal/LinksEditor";
import { OpeningHoursEditor } from "@/components/portal/OpeningHoursEditor";
import type { EntityConfig } from "@/lib/portal/constants";
import { defaultOpeningHours, defaultVenueAddress } from "@/lib/portal/validation";
import type { Coach, Gym, Club, PortalLink, VenueAddress } from "@/lib/portal/types";

type EntityValues = {
  name: string;
  description: string;
  links?: PortalLink[];
  opening_hours?: Gym["opening_hours"] | Club["opening_hours"];
  has_opening_hours?: boolean;
  address?: VenueAddress;
  hide_location?: boolean;
  specialties?: Coach["specialties"];
  radius_served_km?: Coach["radius_served_km"];
  focus_areas?: Gym["focus_areas"];
};

type Props = {
  config: EntityConfig;
  action: (formData: FormData) => Promise<void>;
  entity?: EntityValues;
  submitLabel: string;
  error?: string;
  isCreate?: boolean;
};

export function EntityForm({
  config,
  action,
  entity,
  submitLabel,
  error,
  isCreate = false,
}: Props) {
  const openingHours =
    entity?.opening_hours ?? (config.hasOpeningHours ? defaultOpeningHours() : undefined);
  const address =
    entity?.address ?? (config.hasAddress ? defaultVenueAddress() : undefined);

  return (
    <form action={action} className="min-w-0 space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">Name</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={entity?.name ?? ""}
          placeholder={`${config.label} name`}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">
          Description
        </span>
        <textarea
          name="description"
          rows={5}
          defaultValue={entity?.description ?? ""}
          placeholder="Tell people about your offering..."
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
      </label>

      {config.hasAddress && address ? (
        <AddressEditor
          address={address}
          canHideLocation={config.canHideLocation}
          hideLocation={entity?.hide_location}
        />
      ) : null}

      {config.kind === "coaches" ? (
        <CoachFieldsEditor
          specialties={entity?.specialties}
          radiusServedKm={entity?.radius_served_km}
        />
      ) : null}

      {config.kind === "clubs" && openingHours ? (
        <ClubOpeningHoursSection
          openingHours={openingHours}
          hasOpeningHours={entity?.has_opening_hours ?? true}
        />
      ) : null}

      {config.kind === "gyms" && openingHours ? (
        <>
          <GymFieldsEditor focusAreas={entity?.focus_areas} />
          <OpeningHoursEditor openingHours={openingHours} />
        </>
      ) : null}

      {isCreate ? <LinksEditor mode="create" links={entity?.links} /> : null}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
