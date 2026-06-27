"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { EntitySaveResult } from "@/app/portal/actions";
import { AddressEditor } from "@/components/portal/AddressEditor";
import { ClubOpeningHoursSection } from "@/components/portal/ClubOpeningHoursSection";
import { CoachFieldsEditor } from "@/components/portal/CoachFieldsEditor";
import { GymFieldsEditor } from "@/components/portal/GymFieldsEditor";
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

type FormState = {
  error: string | null;
};

type Props = {
  config: EntityConfig;
  action: (formData: FormData) => Promise<EntitySaveResult>;
  entity?: EntityValues;
  submitLabel: string;
  initialError?: string;
  formId: string;
};

export function EntityForm({
  config,
  action,
  entity,
  submitLabel,
  initialError,
  formId,
}: Props) {
  const router = useRouter();
  const openingHours =
    entity?.opening_hours ?? (config.hasOpeningHours ? defaultOpeningHours() : undefined);
  const address =
    entity?.address ?? (config.hasAddress ? defaultVenueAddress() : undefined);

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await action(formData);

      if (result.ok) {
        router.push(result.redirectTo);
        router.refresh();
        return { error: null };
      }

      return { error: result.error };
    },
    { error: initialError ?? null }
  );

  return (
    <form id={formId} action={formAction} className="min-w-0 space-y-6">
      {state.error ? (
        <div
          className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100"
          role="alert"
        >
          {state.error}
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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] disabled:opacity-60 transition-colors"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
