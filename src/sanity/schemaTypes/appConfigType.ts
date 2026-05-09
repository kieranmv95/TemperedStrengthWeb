import { defineField, defineType } from "sanity";

export const appConfigType = defineType({
  name: "appConfig",
  title: "App Config",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "activeNotification",
      title: "Active Notification",
      type: "reference",
      to: [{ type: "notification" }],
    }),
  ],
});
