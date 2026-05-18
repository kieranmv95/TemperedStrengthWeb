import { type SchemaTypeDefinition } from "sanity";
import { notificationType } from "./notificationType";
import { appConfigType } from "./appConfigType";
import { sponsorAdType } from "./sponsorAdType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [notificationType, appConfigType, sponsorAdType],
};
