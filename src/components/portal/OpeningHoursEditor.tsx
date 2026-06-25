"use client";

import { useMemo, useState } from "react";
import {
  DAYS,
  OPENING_TIME_SLOTS,
  TWENTY_FOUR_HOUR_CLOSE,
  TWENTY_FOUR_HOUR_OPEN,
} from "@/lib/portal/constants";
import { dayHoursToEditorState, snapTimeToSlot } from "@/lib/portal/validation";
import type { DayKey, OpeningHours } from "@/lib/portal/types";

const selectClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-950 px-1.5 py-1 text-xs text-white focus:border-[#c9b072]/50 focus:outline-none";

type DayState = {
  closed: boolean;
  twentyFour: boolean;
  open: string;
  close: string;
};

type Props = {
  openingHours: OpeningHours;
};

function buildInitialState(openingHours: OpeningHours): Record<DayKey, DayState> {
  return DAYS.reduce(
    (acc, { key }) => {
      const state = dayHoursToEditorState(openingHours[key]);
      acc[key] = state.twentyFour
        ? state
        : {
            ...state,
            open: snapTimeToSlot(state.open, "06:00"),
            close: snapTimeToSlot(state.close, "22:00"),
          };
      return acc;
    },
    {} as Record<DayKey, DayState>
  );
}

type DayRowProps = {
  dayKey: DayKey;
  shortLabel: string;
  day: DayState;
  closeOptions: string[];
  onUpdate: (patch: Partial<DayState>) => void;
};

function DayHiddenInputs({
  dayKey,
  day,
}: {
  dayKey: DayKey;
  day: DayState;
}) {
  return (
    <>
      {day.closed ? (
        <input type="hidden" name={`${dayKey}_closed`} value="on" />
      ) : null}
      {day.twentyFour ? (
        <>
          <input type="hidden" name={`${dayKey}_open`} value={TWENTY_FOUR_HOUR_OPEN} />
          <input
            type="hidden"
            name={`${dayKey}_close`}
            value={TWENTY_FOUR_HOUR_CLOSE}
          />
        </>
      ) : null}
    </>
  );
}

function OpenSelect({
  dayKey,
  day,
  onUpdate,
}: {
  dayKey: DayKey;
  day: DayState;
  onUpdate: (patch: Partial<DayState>) => void;
}) {
  if (day.closed) {
    return <span className="text-xs text-neutral-600">—</span>;
  }

  if (day.twentyFour) {
    return <span className="text-xs text-neutral-400">00:00</span>;
  }

  return (
    <select
      name={`${dayKey}_open`}
      value={day.open}
      onChange={(e) => onUpdate({ open: e.target.value })}
      className={selectClass}
    >
      {OPENING_TIME_SLOTS.map((slot) => (
        <option key={slot} value={slot}>
          {slot}
        </option>
      ))}
    </select>
  );
}

function CloseSelect({
  dayKey,
  day,
  closeOptions,
  onUpdate,
}: {
  dayKey: DayKey;
  day: DayState;
  closeOptions: string[];
  onUpdate: (patch: Partial<DayState>) => void;
}) {
  if (day.closed) {
    return <span className="text-xs text-neutral-600">—</span>;
  }

  if (day.twentyFour) {
    return <span className="text-xs text-neutral-400">23:59</span>;
  }

  return (
    <select
      name={`${dayKey}_close`}
      value={day.close}
      onChange={(e) => onUpdate({ close: e.target.value })}
      className={selectClass}
    >
      {closeOptions.map((slot) => (
        <option key={slot} value={slot}>
          {slot}
        </option>
      ))}
    </select>
  );
}

function DayToggles({
  day,
  onUpdate,
}: {
  day: DayState;
  onUpdate: (patch: Partial<DayState>) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-[10px] text-neutral-500">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={day.closed}
          onChange={(e) =>
            onUpdate({
              closed: e.target.checked,
              twentyFour: e.target.checked ? false : day.twentyFour,
            })
          }
          className="rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/40"
          title="Closed"
        />
        Off
      </label>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={day.twentyFour}
          disabled={day.closed}
          onChange={(e) =>
            onUpdate({
              twentyFour: e.target.checked,
              open: TWENTY_FOUR_HOUR_OPEN,
              close: TWENTY_FOUR_HOUR_CLOSE,
            })
          }
          className="rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/40 disabled:opacity-40"
          title="Open 24 hours"
        />
        24h
      </label>
    </div>
  );
}

function MobileDayRow({ dayKey, shortLabel, day, closeOptions, onUpdate }: DayRowProps) {
  return (
    <div className="rounded-md border border-neutral-800/60 p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-300">{shortLabel}</span>
        <DayToggles day={day} onUpdate={onUpdate} />
      </div>

      {!day.closed ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="block min-w-0">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Open
            </span>
            <OpenSelect dayKey={dayKey} day={day} onUpdate={onUpdate} />
          </label>
          <label className="block min-w-0">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-neutral-500">
              Close
            </span>
            <CloseSelect
              dayKey={dayKey}
              day={day}
              closeOptions={closeOptions}
              onUpdate={onUpdate}
            />
          </label>
        </div>
      ) : null}

      <DayHiddenInputs dayKey={dayKey} day={day} />
    </div>
  );
}

function DesktopDayRow({ dayKey, shortLabel, day, closeOptions, onUpdate }: DayRowProps) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_1fr_2.25rem_2.5rem] items-center gap-x-2 gap-y-1 border-b border-neutral-800/40 py-1 last:border-b-0">
      <span className="text-xs font-medium text-neutral-300">{shortLabel}</span>

      <div>
        <OpenSelect dayKey={dayKey} day={day} onUpdate={onUpdate} />
      </div>

      <div>
        <CloseSelect
          dayKey={dayKey}
          day={day}
          closeOptions={closeOptions}
          onUpdate={onUpdate}
        />
      </div>

      <label className="flex justify-center">
        <input
          type="checkbox"
          checked={day.closed}
          onChange={(e) =>
            onUpdate({
              closed: e.target.checked,
              twentyFour: e.target.checked ? false : day.twentyFour,
            })
          }
          className="rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/40"
          title="Closed"
        />
      </label>

      <label className="flex justify-center">
        <input
          type="checkbox"
          checked={day.twentyFour}
          disabled={day.closed}
          onChange={(e) =>
            onUpdate({
              twentyFour: e.target.checked,
              open: TWENTY_FOUR_HOUR_OPEN,
              close: TWENTY_FOUR_HOUR_CLOSE,
            })
          }
          className="rounded border-neutral-700 bg-neutral-950 text-[#c9b072] focus:ring-[#c9b072]/40 disabled:opacity-40"
          title="Open 24 hours"
        />
      </label>

      <DayHiddenInputs dayKey={dayKey} day={day} />
    </div>
  );
}

export function OpeningHoursEditor({ openingHours }: Props) {
  const [days, setDays] = useState(() => buildInitialState(openingHours));

  const closeOptions = useMemo(
    () => [...OPENING_TIME_SLOTS.slice(1), TWENTY_FOUR_HOUR_CLOSE],
    []
  );

  const updateDay = (key: DayKey, patch: Partial<DayState>) => {
    setDays((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }));
  };

  return (
    <fieldset className="min-w-0 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
      <legend className="px-1 text-sm font-semibold text-white">Opening hours</legend>

      <div className="mt-2 space-y-2 md:hidden">
        {DAYS.map(({ key, shortLabel }) => (
          <MobileDayRow
            key={key}
            dayKey={key}
            shortLabel={shortLabel}
            day={days[key]}
            closeOptions={closeOptions}
            onUpdate={(patch) => updateDay(key, patch)}
          />
        ))}
      </div>

      <div className="mt-2 hidden md:block">
        <div className="grid grid-cols-[2.5rem_1fr_1fr_2.25rem_2.5rem] gap-x-2 gap-y-1 border-b border-neutral-800/80 pb-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          <span />
          <span>Open</span>
          <span>Close</span>
          <span className="text-center">Off</span>
          <span className="text-center">24h</span>
        </div>

        {DAYS.map(({ key, shortLabel }) => (
          <DesktopDayRow
            key={key}
            dayKey={key}
            shortLabel={shortLabel}
            day={days[key]}
            closeOptions={closeOptions}
            onUpdate={(patch) => updateDay(key, patch)}
          />
        ))}
      </div>

      <p className="mt-2 text-[10px] text-neutral-500">
        Off = closed. 24h is stored as 00:00–23:59 in your existing schedule.
      </p>
    </fieldset>
  );
}
