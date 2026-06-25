import Link from "next/link";
import { EntityCard } from "@/components/portal/EntityCard";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";
import { mapClub, mapCoach, mapGym } from "@/lib/portal/db";
import { APPROVAL_SLA } from "@/lib/portal/statusCopy";
import { createClient } from "@/lib/supabase/server";

export default async function PortalHubPage() {
  const supabase = await createClient();

  const [gymsResult, clubsResult, coachesResult] = await Promise.all([
    supabase.from("gyms").select("*").order("created_at", { ascending: false }),
    supabase.from("clubs").select("*").order("created_at", { ascending: false }),
    supabase
      .from("coaches")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const gyms = (gymsResult.data ?? []).map((row) => mapGym(row));
  const clubs = (clubsResult.data ?? []).map((row) => mapClub(row));
  const coaches = (coachesResult.data ?? []).map((row) => mapCoach(row));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Partner portal</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Manage gym, club, and coaching profiles for Tempered Strength. Create
          a profile, submit it for review, and unlock partner tools once
          approved. {APPROVAL_SLA}
        </p>
      </div>

      {(
        [
          { kind: "gyms" as const, items: gyms },
          { kind: "clubs" as const, items: clubs },
          { kind: "coaches" as const, items: coaches },
        ] as const
      ).map(({ kind, items }) => {
        const config = ENTITY_CONFIGS[kind];
        return (
          <section key={kind} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-white">{config.plural}</h2>
                <p className="mt-1 text-sm text-neutral-500">{config.description}</p>
              </div>
              <Link
                href={`/portal/${kind}/new`}
                className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-[#c9b072] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d4c08a] transition-colors sm:w-auto"
              >
                Add {config.singular}
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-4 py-8 text-center text-sm text-neutral-500">
                No {config.plural.toLowerCase()} yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {items.map((item) => (
                  <EntityCard
                    key={item.id}
                    kind={kind}
                    id={item.id}
                    name={item.name}
                    status={item.status}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
