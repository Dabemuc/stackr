import { ComponentFormData } from "@/components/ComponentForm";
import { ComponentInsertSchema } from "./zodSchemas";

export default function insertComponentValidator(data: ComponentFormData) {
  return ComponentInsertSchema.parse(data);
}
