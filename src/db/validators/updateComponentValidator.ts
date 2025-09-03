import { ComponentFormData } from "@/components/ComponentForm";
import { ComponentUpdateSchema } from "./zodSchemas";

export default function updateComponentValidator(
  data: ComponentFormData & { id: number },
) {
  return ComponentUpdateSchema.parse(data);
}
