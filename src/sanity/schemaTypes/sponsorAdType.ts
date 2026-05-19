import { defineField, defineType } from "sanity";
import { colorField } from "./colorField";

type SponsorAdDocument = {
  layout?: "textHeader" | "logoHeader" | "productLeft";
  title?: string;
  logo?: unknown;
  productImage?: unknown;
};

export const sponsorAdType = defineType({
  name: "sponsorAd",
  title: "Sponsor Ad",
  type: "document",
  fieldsets: [
    {
      name: "colors",
      title: "Colours",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "internalName",
      title: "Internal name",
      type: "string",
      description: "Studio-only label (not shown in the app).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "e.g. Nutrition, Sweets, Apparel. Used for filtering or grouping in the app.",
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Text header", value: "textHeader" },
          { title: "Logo header", value: "logoHeader" },
          { title: "Product left", value: "productLeft" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / brand name",
      type: "string",
      description:
        "Shown as the brand name (text header) or card title (other layouts).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Keep to about three lines; the app uses a fixed card height.",
      validation: (Rule) =>
        Rule.required().max(280).error("Description must be 280 characters or fewer."),
    }),
    defineField({
      name: "affiliateUrl",
      title: "Affiliate URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      initialValue: "Visit Website",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description: "Used for logo header layout.",
    }),
    defineField({
      name: "productImage",
      title: "Product image",
      type: "image",
      options: { hotspot: true },
      description: "Used for product left layout (tall image in left column).",
    }),
    colorField("backgroundColor", "Background colour", "#ffffff"),
    colorField("titleColor", "Title colour", "#111111"),
    colorField("descriptionColor", "Description colour", "#444444"),
    colorField("ctaBackgroundColor", "CTA background colour", "#111111"),
    colorField("ctaTextColor", "CTA text colour", "#ffffff"),
  ],
  preview: {
    select: {
      title: "internalName",
      layout: "layout",
      enabled: "enabled",
      categories: "categories",
    },
    prepare({ title, layout, enabled, categories }) {
      const layoutLabel =
        layout === "textHeader"
          ? "Text header"
          : layout === "logoHeader"
            ? "Logo header"
            : layout === "productLeft"
              ? "Product left"
              : layout ?? "No layout";
      const categoryLabel =
        Array.isArray(categories) && categories.length > 0
          ? categories.join(", ")
          : null;
      const status = enabled === false ? "Disabled" : "Enabled";
      const subtitle = [layoutLabel, categoryLabel, status]
        .filter(Boolean)
        .join(" · ");
      return {
        title: title ?? "Untitled sponsor ad",
        subtitle,
      };
    },
  },
  validation: (Rule) =>
    Rule.custom((doc: unknown) => {
      const d = doc as SponsorAdDocument | undefined;
      if (!d?.layout) return true;

      if (d.layout === "textHeader" && !d.title?.trim()) {
        return "Title is required for text header layout.";
      }

      if (d.layout === "logoHeader" && !d.logo && !d.title?.trim()) {
        return "Add a logo image or title for logo header layout.";
      }

      if (d.layout === "productLeft") {
        if (!d.title?.trim()) {
          return "Title is required for product left layout.";
        }
        if (!d.productImage) {
          return "Product image is required for product left layout.";
        }
      }

      return true;
    }),
});
