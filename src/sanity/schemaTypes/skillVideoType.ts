import { defineField, defineType } from "sanity";

export const skillVideoType = defineType({
  name: "skillVideo",
  title: "Skill Video",
  type: "object",
  fields: [
    defineField({
      name: "youtubeId",
      title: "YouTube ID",
      type: "string",
      description:
        "YouTube video id only (e.g. oJf2Mnn4NVc), not a full URL.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (/https?:\/\/|youtube\.com|youtu\.be/i.test(value)) {
            return "Enter the YouTube video id only (e.g. oJf2Mnn4NVc), not a URL.";
          }
          return true;
        }),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "youtubeId",
    },
  },
});
