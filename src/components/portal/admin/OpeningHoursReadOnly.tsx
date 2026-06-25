import { DAYS } from "@/lib/portal/constants";
import type { DayHours, OpeningHours } from "@/lib/portal/types";

function formatDayHours(day: DayHours | undefined): string {
  if (!day) return "—";
  if ("closed" in day) return "Closed";
  return `${day.open} – ${day.close}`;
}

type Props = {
  openingHours: OpeningHours;
  hasOpeningHours?: boolean;
};

export function OpeningHoursReadOnly({ openingHours, hasOpeningHours = true }: Props) {
  if (!hasOpeningHours) {
    return (
      <p className="text-sm text-neutral-400">
        No fixed opening hours (session times vary).
      </p>
    );
  }

  return (
    <dl className="divide-y divide-neutral-800/60 rounded-lg border border-neutral-800/80">
      {DAYS.map(({ key, label }) => (
        <div
          key={key}
          className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
        >
          <dt className="text-neutral-400">{label}</dt>
          <dd className="text-white tabular-nums">{formatDayHours(openingHours[key])}</dd>
        </div>
      ))}
    </dl>
  );
}
