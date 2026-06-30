import Link from "next/link";
import { AdminApproveButton } from "@/components/portal/admin/AdminApproveButton";
import { AdminRejectForm } from "@/components/portal/admin/AdminRejectForm";
import { OpeningHoursReadOnly } from "@/components/portal/admin/OpeningHoursReadOnly";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";
import type { AdminOwnerInfo } from "@/lib/portal/adminData";
import type { EntityRow } from "@/lib/portal/db";
import { formatAddressDisplay } from "@/lib/portal/validation";
import type { Club, Coach, Gym, PortalEntityKind } from "@/lib/portal/types";

type Props = {
  kind: PortalEntityKind;
  entity: EntityRow;
  owner: AdminOwnerInfo;
  approved?: boolean;
  rejected?: boolean;
  error?: string;
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function AdminEntityReview({
  kind,
  entity,
  owner,
  approved,
  rejected,
  error,
}: Props) {
  const config = ENTITY_CONFIGS[kind];
  const isPending = entity.status === "pending";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={`/portal/admin/${kind}`}
            className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            ← All {config.plural.toLowerCase()}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-bold text-white break-words sm:text-3xl">
              {entity.name}
            </h1>
            <StatusBadge status={entity.status} className="shrink-0" />
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            {config.label} listing · Created {formatWhen(entity.created_at)}
          </p>
        </div>

        {isPending ? (
          <AdminApproveButton kind={kind} id={entity.id} />
        ) : null}
      </div>

      {approved ? (
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
          Listing approved. It will appear in the app on the next API refresh.
        </div>
      ) : null}

      {rejected ? (
        <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          Listing rejected. The owner can edit and resubmit from their portal.
        </div>
      ) : null}

      {error && !isPending ? (
        <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
          <DetailSection title="Owner">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-500">Portal name</dt>
                <dd className="mt-0.5 text-white">{owner.displayName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Email</dt>
                <dd className="mt-0.5 break-all text-white">{owner.email ?? "—"}</dd>
              </div>
            </dl>
          </DetailSection>

          <DetailSection title="Review timeline">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-500">Submitted</dt>
                <dd className="mt-0.5 text-white">{formatWhen(entity.submitted_at)}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Approved</dt>
                <dd className="mt-0.5 text-white">{formatWhen(entity.approved_at)}</dd>
              </div>
              {entity.rejection_note ? (
                <div>
                  <dt className="text-neutral-500">Rejection note</dt>
                  <dd className="mt-0.5 text-red-200">{entity.rejection_note}</dd>
                </div>
              ) : null}
            </dl>
          </DetailSection>

          <DetailSection title="Description">
            {entity.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                {entity.description}
              </p>
            ) : (
              <p className="text-sm text-neutral-500">No description provided.</p>
            )}
          </DetailSection>

          <DetailSection title="Public contact">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-500">Email</dt>
                <dd className="mt-0.5 break-all text-white">
                  {entity.email ? (
                    <a
                      href={`mailto:${entity.email}`}
                      className="text-[#c9b072] hover:underline"
                    >
                      {entity.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Phone</dt>
                <dd className="mt-0.5 text-white">
                  {entity.phone ? (
                    <a
                      href={`tel:${entity.phone.replace(/\s/g, "")}`}
                      className="text-[#c9b072] hover:underline"
                    >
                      {entity.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </DetailSection>
        </div>

        <div className="min-w-0 space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
          {"address" in entity ? (
            <DetailSection title="Location">
              <p className="text-sm text-neutral-300">
                {formatAddressDisplay(entity.address)}
              </p>
              {entity.map_marker ? (
                <p className="mt-2 text-xs text-emerald-300/90">
                  Exact map marker:{" "}
                  <span className="tabular-nums text-white">
                    {entity.map_marker.latitude}, {entity.map_marker.longitude}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-xs text-neutral-500">
                  No map marker — app will fall back to address postcode.
                </p>
              )}
              {"hide_location" in entity && entity.hide_location ? (
                <p className="text-xs text-amber-300/90">
                  Hidden from the app (address for records only).
                </p>
              ) : null}
            </DetailSection>
          ) : null}

          {kind === "coaches" ? (
            <DetailSection title="Coaching details">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-neutral-500">Specialties</dt>
                  <dd className="mt-1.5">
                    {(entity as Coach).specialties.length > 0 ? (
                      <ul className="flex flex-wrap gap-2">
                        {(entity as Coach).specialties.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-white"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-white">—</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Radius served</dt>
                  <dd className="mt-0.5 text-white">
                    {(entity as Coach).radius_served_km != null
                      ? `${(entity as Coach).radius_served_km} km`
                      : "—"}
                  </dd>
                </div>
              </dl>
            </DetailSection>
          ) : null}

          {kind === "gyms" ? (
            <DetailSection title="Focus areas">
              {(entity as Gym).focus_areas.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {(entity as Gym).focus_areas.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500">None listed.</p>
              )}
            </DetailSection>
          ) : null}

          {kind === "gyms" || kind === "clubs" ? (
            <DetailSection title="Opening hours">
              <OpeningHoursReadOnly
                openingHours={(entity as Gym | Club).opening_hours}
                hasOpeningHours={
                  kind === "clubs" ? (entity as Club).has_opening_hours : true
                }
              />
            </DetailSection>
          ) : null}

          <DetailSection title="Links">
            {entity.links.length > 0 ? (
              <ul className="space-y-2">
                {entity.links.map((link, index) => (
                  <li key={`${link.url}-${index}`} className="text-sm">
                    <span className="text-neutral-500">{link.label || "Link"}: </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[#c9b072] hover:underline"
                    >
                      {link.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">No links provided.</p>
            )}
          </DetailSection>
        </div>
      </div>

      {isPending ? (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Reject listing</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Optional note for the owner — they&apos;ll see this in their portal so
            they know what to fix before resubmitting.
          </p>
          <AdminRejectForm kind={kind} id={entity.id} initialError={error} />
        </div>
      ) : null}
    </div>
  );
}
