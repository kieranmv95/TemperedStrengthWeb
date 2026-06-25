import { AddressEditor } from "@/components/portal/AddressEditor";
import { LinksEditor } from "@/components/portal/LinksEditor";
import { OpeningHoursEditor } from "@/components/portal/OpeningHoursEditor";
import type { EntityConfig } from "@/lib/portal/constants";
import { defaultOpeningHours, defaultVenueAddress } from "@/lib/portal/validation";
import type { Gym, Club, PortalLink, VenueAddress } from "@/lib/portal/types";

type EntityValues = {
  name: string;
  description: string;
  links: PortalLink[];
  opening_hours?: Gym["opening_hours"] | Club["opening_hours"];
  address?: VenueAddress;
};

type Props = {
  config: EntityConfig;
  action: (formData: FormData) => Promise<void>;
  entity?: EntityValues;
  submitLabel: string;
  error?: string;
};

export function EntityForm({
  config,
  action,
  entity,
  submitLabel,
  error,
}: Props) {
  const openingHours =
    entity?.opening_hours ?? (config.hasOpeningHours ? defaultOpeningHours() : undefined);
  const address =
    entity?.address ?? (config.hasAddress ? defaultVenueAddress() : undefined);
  const links = entity?.links ?? [];

  return (
    <form action={action} className="space-y-6">
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
        <AddressEditor address={address} entityLabel={config.label} />
      ) : null}

      {config.hasOpeningHours && openingHours ? (
        <OpeningHoursEditor openingHours={openingHours} />
      ) : null}

      <LinksEditor links={links} />

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-[#c9b072] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#d4c08a] transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
