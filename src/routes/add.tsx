import ComponentForm from "@/components/ComponentForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add")({
  component: ComponentForm,
});
