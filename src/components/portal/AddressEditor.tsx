import type { VenueAddress } from "@/lib/portal/types";

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none";

type Props = {
  address: VenueAddress;
  entityLabel?: string;
};

export function AddressEditor({ address, entityLabel = "venue" }: Props) {
  return (
    <fieldset className="space-y-4">
      <div>
        <legend className="text-sm font-semibold text-white">Address</legend>
        <p className="mt-1 text-sm text-neutral-500">
          Full address for maps and directions. We&apos;ll use this to place your{" "}
          {entityLabel.toLowerCase()} on a map in a future update.
        </p>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-400">
          Address line 1 <span className="text-[#c9b072]">*</span>
        </span>
        <input
          type="text"
          name="address_line1"
          required
          defaultValue={address.line1}
          placeholder="Building name and street"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-400">
          Address line 2
        </span>
        <input
          type="text"
          name="address_line2"
          defaultValue={address.line2 ?? ""}
          placeholder="Unit, floor, etc. (optional)"
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            City <span className="text-[#c9b072]">*</span>
          </span>
          <input
            type="text"
            name="address_city"
            required
            defaultValue={address.city}
            placeholder="City or town"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            County / region
          </span>
          <input
            type="text"
            name="address_county"
            defaultValue={address.county ?? ""}
            placeholder="Optional"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Postcode <span className="text-[#c9b072]">*</span>
          </span>
          <input
            type="text"
            name="address_postcode"
            required
            defaultValue={address.postcode}
            placeholder="e.g. SW1A 1AA"
            className={inputClass}
            autoComplete="postal-code"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-400">
            Country
          </span>
          <input
            type="text"
            name="address_country"
            defaultValue={address.country || "GB"}
            placeholder="GB"
            className={inputClass}
            autoComplete="country"
          />
        </label>
      </div>
    </fieldset>
  );
}
