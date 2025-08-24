import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/view")({
  validateSearch: (search) => ({
    id: search.id ? Number(search.id) : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const routeSearch = useSearch({ from: "/view" });
  return (
    <div>
      <p>Hello "/view"!</p>
      <p>Id:{routeSearch.id}</p>
    </div>
  );
}
