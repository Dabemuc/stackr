import { ComponentInsertSchema, ComponentInsertType } from "./zodSchemas";

export default function insertComponentValidator(data: ComponentInsertType) {
  return ComponentInsertSchema.parse(data);
}
