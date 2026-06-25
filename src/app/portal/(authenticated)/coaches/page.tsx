import { EntityListView } from "@/components/portal/entityViews";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";

export default function CoachesPage() {
  return <EntityListView config={ENTITY_CONFIGS.coaches} />;
}
