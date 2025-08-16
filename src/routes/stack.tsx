import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stack")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="text-center">Hello "/stack"!</div>;
}
