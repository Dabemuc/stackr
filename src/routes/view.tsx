import { findComponentById } from "@/db/db";
import { FindComponentByIdResult } from "@/db/handlers/findComponentByIdHandler";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/view")({
  validateSearch: (search) => ({
    id: search.id ? Number(search.id) : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const routeSearch = useSearch({ from: "/view" });

  const [data, setData] = useState<FindComponentByIdResult>();

  // Fetch data on initial load
  useEffect(() => {
    async function fetchData() {
      if (routeSearch.id)
        setData(await findComponentById({ data: routeSearch.id }));
    }

    fetchData();
  }, []);

  return (
    <div>
      <p>Hello "/view"!</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
