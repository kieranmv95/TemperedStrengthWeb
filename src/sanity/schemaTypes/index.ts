import { type SchemaTypeDefinition } from "sanity";
import { notificationType } from "./notificationType";
import { appConfigType } from "./appConfigType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [notificationType, appConfigType],
};
