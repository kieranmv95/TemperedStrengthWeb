import { EntityForm } from "@/components/portal/EntityForm";
import { createEntity } from "@/app/portal/actions";
import type { EntityConfig } from "@/lib/portal/constants";
import { APPROVAL_SLA } from "@/lib/portal/statusCopy";

type Props = {
  config: EntityConfig;
  error?: string;
};

export function EntityNewView({ config, error }: Props) {
  const action = createEntity.bind(null, config.kind);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Add {config.singular}</h1>
        <p className="mt-2 text-neutral-400">
          Create a new {config.singular} profile. You can submit it for review
          once you&apos;re ready. {APPROVAL_SLA}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 md:p-8">
        <EntityForm
          config={config}
          action={action}
          submitLabel={`Create ${config.singular}`}
          error={error}
        />
      </div>
    </div>
  );
}
