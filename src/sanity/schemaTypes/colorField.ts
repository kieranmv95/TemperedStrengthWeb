import { defineField } from "sanity";

export const HEX_COLOR =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const colorField = (
  name: string,
  title: string,
  initialValue: string,
) =>
  defineField({
    name,
    title,
    type: "string",
    fieldset: "colors",
    initialValue,
    description: "Hex colour, e.g. #1a1f2b",
    validation: (Rule) =>
      Rule.regex(HEX_COLOR).error(
        "Must be a valid hex colour (e.g. #1a1f2b or #fffa).",
      ),
  });
