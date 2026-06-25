import { notFound } from "next/navigation";
import { EntityDetailView } from "@/components/portal/EntityDetailView";
import {
  fetchOwnedEntity,
  invalidEntityId,
} from "@/components/portal/entityViews";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; submitted?: string; error?: string }>;
};

export default async function CoachDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  invalidEntityId(id);

  const entity = await fetchOwnedEntity("coaches", id, ENTITY_CONFIGS.coaches);
  if (!entity) notFound();

  const query = await searchParams;

  return (
    <EntityDetailView
      config={ENTITY_CONFIGS.coaches}
      entity={entity}
      saved={query.saved === "1"}
      submitted={query.submitted === "1"}
      error={query.error}
    />
  );
}
