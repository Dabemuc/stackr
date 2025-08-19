import ComponentsVisualizer from "@/components/ComponentsVisualizer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <ComponentsVisualizer />
    </div>
  );
}
