import { EntityNewView } from "@/components/portal/EntityNewView";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewClubPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <EntityNewView config={ENTITY_CONFIGS.clubs} error={error} />;
}
