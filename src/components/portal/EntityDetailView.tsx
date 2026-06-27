import Link from "next/link";
import { EntityActions } from "@/components/portal/EntityActions";
import { EntityForm } from "@/components/portal/EntityForm";
import { GatedSection } from "@/components/portal/GatedSection";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { StatusBanner } from "@/components/portal/StatusBanner";
import { updateEntity } from "@/app/portal/actions";
import type { EntityConfig } from "@/lib/portal/constants";
import { APPROVAL_SLA } from "@/lib/portal/statusCopy";
import type { EntityRow } from "@/lib/portal/db";

type Props = {
  config: EntityConfig;
  entity: EntityRow;
  saved?: boolean;
  submitted?: boolean;
  error?: string;
};

export function EntityDetailView({
  config,
  entity,
  saved,
  submitted,
  error,
}: Props) {
  const action = updateEntity.bind(null, config.kind, entity.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={`/portal/${config.kind}`}
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
        </div>
        <EntityActions
          kind={config.kind}
          id={entity.id}
          name={entity.name}
          entityLabel={config.label}
          status={entity.status}
        />
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
          Changes saved.
        </div>
      ) : null}

      {submitted && entity.status === "pending" ? (
        <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Submitted for review</p>
          <p className="mt-1">{APPROVAL_SLA}</p>
        </div>
      ) : null}

      <StatusBanner
        status={entity.status}
        rejectionNote={entity.rejection_note}
        submittedAt={entity.submitted_at}
      />

      <div className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        {entity.status === "approved" ? (
          <p className="mt-2 text-sm text-neutral-400">
            You can update your profile at any time. Changes save immediately and
            your approved status stays the same — no need to resubmit for review.
          </p>
        ) : null}
        <div className="mt-6">
          <EntityForm
            config={config}
            action={action}
            formId={`portal-edit-${config.kind}-${entity.id}`}
            entity={{
              name: entity.name,
              description: entity.description ?? "",
              opening_hours:
                "opening_hours" in entity ? entity.opening_hours : undefined,
              has_opening_hours:
                "has_opening_hours" in entity
                  ? entity.has_opening_hours
                  : undefined,
              address: "address" in entity ? entity.address : undefined,
              hide_location:
                "hide_location" in entity ? entity.hide_location : undefined,
              specialties:
                "specialties" in entity ? entity.specialties : undefined,
              radius_served_km:
                "radius_served_km" in entity
                  ? entity.radius_served_km
                  : undefined,
              focus_areas:
                "focus_areas" in entity ? entity.focus_areas : undefined,
            }}
            submitLabel="Save changes"
            initialError={error}
            editLinks={{
              kind: config.kind,
              entityId: entity.id,
              links: entity.links,
            }}
          />
        </div>
      </div>

      <GatedSection status={entity.status} entityLabel={config.label}>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 text-sm text-neutral-300">
          Partner tools for {config.plural.toLowerCase()} will appear here —
          programs, promotions, and member features are coming soon.
        </div>
      </GatedSection>
    </div>
  );
}
