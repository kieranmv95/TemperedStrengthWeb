import { DAYS } from "@/lib/portal/constants";
import { defaultDayHours } from "@/lib/portal/validation";
import type { OpeningHours } from "@/lib/portal/types";

type Props = {
  openingHours: OpeningHours;
};

export function OpeningHoursEditor({ openingHours }: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-white">Opening hours</legend>
      <div className="space-y-3">
        {DAYS.map(({ key, label }) => {
          const day = defaultDayHours(openingHours[key] ?? { open: "06:00", close: "22:00" });
          return (
            <div
              key={key}
              className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/40 p-3 sm:grid-cols-[8rem_1fr_1fr_auto]"
            >
              <p className="text-sm font-medium text-white self-center">{label}</p>
              <label className="block">
                <span className="mb-1 block text-xs text-neutral-500">Opens</span>
                <input
                  type="time"
                  name={`${key}_open`}
                  defaultValue={day.open}
                  disabled={day.closed}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white disabled:opacity-40 focus:border-[#c9b072]/50 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-neutral-500">Closes</span>
                <input
                  type="time"
                  name={`${key}_close`}
                  defaultValue={day.close}
                  disabled={day.closed}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white disabled:opacity-40 focus:border-[#c9b072]/50 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  name={`${key}_closed`}
                  defaultChecked={day.closed}
                  className="rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/40"
                />
                Closed
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
