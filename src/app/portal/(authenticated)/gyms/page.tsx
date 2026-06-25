import { EntityListView } from "@/components/portal/entityViews";
import { ENTITY_CONFIGS } from "@/lib/portal/constants";

export default function GymsPage() {
  return <EntityListView config={ENTITY_CONFIGS.gyms} />;
}
