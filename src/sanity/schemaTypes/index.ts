import { type SchemaTypeDefinition } from "sanity";
import { notificationType } from "./notificationType";
import { appConfigType } from "./appConfigType";
import { sponsorAdType } from "./sponsorAdType";
import { skillType } from "./skillType";
import { skillVideoType } from "./skillVideoType";
import { skillCueType } from "./skillCueType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    notificationType,
    appConfigType,
    sponsorAdType,
    skillType,
    skillVideoType,
    skillCueType,
  ],
};
