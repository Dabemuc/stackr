import { createFileRoute } from "@tanstack/react-router";
import View from "@/components/View";

export const Route = createFileRoute("/view")({
  validateSearch: (search) => ({
    id: search.id ? Number(search.id) : undefined,
  }),
  component: View,
});
