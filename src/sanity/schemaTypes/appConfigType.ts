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
    defineField({
      name: "activeSponsorAds",
      title: "Home sponsor ads",
      type: "array",
      of: [{ type: "reference", to: [{ type: "sponsorAd" }] }],
      description:
        "Drag to set carousel order. Only reference ads with Enabled turned on. The Tempered Strength app reads this list on the Home tab.",
    }),
    defineField({
      name: "sponsorCarouselIntervalSeconds",
      title: "Sponsor carousel interval (seconds)",
      type: "number",
      initialValue: 6,
      validation: (Rule) => Rule.required().min(3).max(30),
    }),
  ],
});
