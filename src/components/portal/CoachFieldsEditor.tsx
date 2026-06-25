import { formatSpecialtiesForForm } from "@/lib/portal/validation";

type Props = {
  specialties?: string[];
  radiusServedKm?: number | null;
};

export function CoachFieldsEditor({
  specialties = [],
  radiusServedKm = null,
}: Props) {
  return (
    <div className="space-y-6">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">
          Specialties
        </span>
        <textarea
          name="specialties"
          rows={3}
          defaultValue={formatSpecialtiesForForm(specialties)}
          placeholder="e.g. Powerlifting, Nutrition, Online coaching"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          Separate with commas. Up to 20 specialties, 50 characters each.
        </p>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-white">
          Approximate radius served (km)
        </span>
        <input
          type="number"
          name="radius_served_km"
          min={1}
          max={500}
          step={0.1}
          defaultValue={radiusServedKm ?? ""}
          placeholder="e.g. 25"
          className="w-full max-w-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          Optional. How far from your base address you typically work with
          clients.
        </p>
      </label>
    </div>
  );
}
