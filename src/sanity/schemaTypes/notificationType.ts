import { defineField, defineType } from "sanity";

export const notificationType = defineType({
  name: "notification",
  title: "Notification",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "string" }),
    defineField({ name: "internalCtaText", type: "string" }),
    defineField({ name: "internalCtaUrl", type: "string" }),
  ],
});
