import { defineField, defineType } from "sanity";
import { colorField } from "./colorField";

export const notificationType = defineType({
  name: "notification",
  title: "Notification",
  type: "document",
  fieldsets: [
    {
      name: "colors",
      title: "Colours",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "string" }),
    defineField({ name: "internalCtaText", type: "string" }),
    defineField({ name: "internalCtaUrl", type: "string" }),
    colorField("borderColor", "Border colour", "#2a3142"),
    colorField("bgColor", "Background colour", "#1a1f2b"),
    colorField("titleColor", "Title colour", "#ffffff"),
    colorField("descriptionColor", "Description colour", "#cbd5e1"),
    colorField("ctaColor", "CTA background colour", "#d4b96a"),
    colorField("ctaTextColor", "CTA text colour", "#1a1f2b"),
  ],
});
