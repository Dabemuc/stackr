import { ComponentUpdateSchema, ComponentUpdateType } from "./zodSchemas";

export default function updateComponentValidator(data: ComponentUpdateType) {
  return ComponentUpdateSchema.parse(data);
}
