import ComponentForm from "@/components/ComponentForm";
import { authStateFn } from "@/integrations/clerk/authStateFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add")({
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => ({ userId: context.userId }),
  component: ComponentForm,
});
