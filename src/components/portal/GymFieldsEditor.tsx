import { TagListInput } from "@/components/portal/TagListInput";

type Props = {
  focusAreas?: string[];
};

export function GymFieldsEditor({ focusAreas = [] }: Props) {
  return (
    <TagListInput
      name="focus_areas"
      label="Focus areas"
      description="Optional. Types of training your gym offers — helps members find the right fit."
      placeholder="e.g. CrossFit"
      initialTags={focusAreas}
      itemLabel="focus area"
      itemLabelPlural="focus areas"
      exampleTags={["CrossFit", "Conditioning", "Hyrox", "Olympic lifting"]}
    />
  );
}
