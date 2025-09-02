import ComponentsVisualizer from "@/components/ComponentsVisualizer";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: z.object({
    search: z.string().optional(),
    status: z.array(z.string()).optional(),
    type: z.array(z.string()).optional(),
    tag: z.array(z.number()).optional(),
  }),
});

function App() {
  return (
    <div className="text-center">
      <ComponentsVisualizer />
    </div>
  );
}
