import { defineField, defineType } from "sanity";

/**
 * Skills & Cues coaching resource for the Tempered Strength app.
 *
 * String link fields (articleSlugs, recoveryFlowIds, workoutIds) are app-local
 * ids — not Sanity references. The app resolves them against Brief/API articles
 * and bundled recovery/workout data.
 */
export const skillType = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  description:
    "Coaching resource for a complex skill (e.g. Handstand Push Up), shown in Skills & Cues.",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "videos", title: "Videos" },
    { name: "tips", title: "Tips" },
    { name: "cues", title: "Cues" },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'Skill title, e.g. "Hand Stand Push Up".',
      group: "basics",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Public skill id for the app (slug.current). Stable across environments.",
      group: "basics",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value?.current) {
            return "Slug is required";
          }

          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2024-01-01" });
          const id = document?._id?.replace(/^drafts\./, "") ?? "";
          const isUnique = await client.fetch(
            `!defined(*[
              !(_id in [$draft, $published]) &&
              _type == "skill" &&
              slug.current == $slug
            ][0]._id)`,
            {
              draft: `drafts.${id}`,
              published: id,
              slug: value.current,
            },
          );

          return isUnique || "Slug must be unique";
        }),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      description: "Card/list thumbnail.",
      group: "basics",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Short summary on the skill card and detail header.",
      group: "basics",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      group: "videos",
      of: [{ type: "skillVideo" }],
      options: { sortable: true },
    }),
    defineField({
      name: "tips",
      title: "Tips",
      type: "array",
      description: "Short coaching tips shown in a carousel.",
      group: "tips",
      of: [{ type: "string" }],
      options: { sortable: true },
    }),
    defineField({
      name: "cues",
      title: "Cues",
      type: "array",
      description: "Visual coaching cues (fullscreen image + text).",
      group: "cues",
      of: [{ type: "skillCue" }],
      options: { sortable: true },
    }),
    defineField({
      name: "articleSlugs",
      title: "Article slugs",
      type: "array",
      description:
        "Brief article slugs resolved by the app (e.g. the-science-of-progressive-overload). Not Sanity references.",
      group: "links",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "recoveryFlowIds",
      title: "Recovery flow IDs",
      type: "array",
      description:
        "Local app recovery flow ids (e.g. r_01, r_02). Match bundled recovery data — not Sanity documents.",
      group: "links",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "workoutIds",
      title: "Workout IDs",
      type: "array",
      description:
        "Local app standalone workout ids (e.g. f_17, rh_09). Match bundled workout data — not Sanity documents. App maps this to workoutsIds.",
      group: "links",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "thumbnail",
      subtitle: "slug.current",
    },
  },
});
