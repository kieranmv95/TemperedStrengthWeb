import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { events, type Event } from "@/data/events";

export const metadata: Metadata = {
  title: "Events | Tempered Strength",
  description: "Upcoming Tempered Strength events and calendar.",
};

function formatEventDate(event: Event): string {
  const start = new Date(`${event.startDate}T12:00:00`);
  const end = new Date(`${event.endDate}T12:00:00`);

  const sameDay = event.startDate === event.endDate;
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  if (sameDay) {
    return start.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (sameMonth) {
    const startDay = start.toLocaleDateString("en-GB", { day: "numeric" });
    const endDay = end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${startDay}–${endDay}`;
  }

  const startLabel = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
  const endLabel = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

function isPastEvent(event: Event, today: string): boolean {
  return event.endDate < today;
}

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sortedEvents(today: string) {
  return [...events].sort((a, b) => {
    const aPast = isPastEvent(a, today);
    const bPast = isPastEvent(b, today);
    if (aPast !== bPast) return aPast ? 1 : -1;
    return a.startDate.localeCompare(b.startDate);
  });
}

export default function EventsPage() {
  const today = getTodayDateString();
  const calendar = sortedEvents(today);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(rgba(201,176,114,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,176,114,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-12">
        <SiteHeader className="mb-12 md:mb-16" />

        <section className="mb-10 text-center md:mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#c9b072] md:text-sm">
            Calendar
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:mb-5 md:text-5xl lg:text-6xl">
            Events
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-400 text-balance sm:text-base">
            Come and say hello at any of our events. Pick up exclusive discounts
            on merch and memberships, and take on our mini competitions, a chance
            to test yourself against the field.
          </p>
        </section>

        <section className="mx-auto max-w-2xl space-y-3">
          {calendar.map((event) => {
            const past = isPastEvent(event, today);
            return (
              <a
                key={`${event.title}-${event.startDate}`}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 md:p-6 hover:border-[#c9b072]/35 hover:bg-neutral-900/70 transition-colors ${
                  past ? "opacity-50" : ""
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400">
                  <time dateTime={event.startDate}>{formatEventDate(event)}</time>
                  {event.allDay ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c9b072]">
                      All day
                    </span>
                  ) : null}
                </div>
                <h2 className="text-lg font-semibold leading-snug md:text-xl">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">{event.location}</p>
              </a>
            );
          })}
        </section>
      </div>
    </main>
  );
}
