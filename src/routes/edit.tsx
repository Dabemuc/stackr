import ComponentForm, { ComponentFormData } from "@/components/ComponentForm";
import { findComponentById, updateComponent } from "@/db/db";
import { FindComponentByIdResult } from "@/db/handlers/findComponentByIdHandler";
import { authStateFn } from "@/integrations/clerk/authStateFn";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/edit")({
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => ({ userId: context.userId }),
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id ? Number(search.id) : undefined,
  }),
});

function RouteComponent() {
  const routeSearch = useSearch({ from: "/edit" });
  const [data, setData] = useState<FindComponentByIdResult>();

  // Fetch component data on load
  useEffect(() => {
    async function fetchData() {
      if (routeSearch.id) {
        setData(await findComponentById({ data: routeSearch.id }));
      }
    }
    fetchData();
  }, [routeSearch.id]);

  if (!data) return <p className="p-4 text-muted-foreground">Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Component</h1>
      <ComponentForm
        handleSubmit={(submittedData: ComponentFormData) => {
          return new Promise(async (resolve) => {
            if (!routeSearch.id)
              resolve({
                success: false,
                error: "Can not get id from search param.",
              });
            const updateData = { ...submittedData, id: routeSearch.id! };
            resolve(updateComponent({ data: updateData }));
          });
        }}
        defaultVals={{
          name: data.name,
          description: data.description ?? "",
          article: data.article ?? "",
          type: data.types,
          status: data.status,
          links: data.links ?? [],
          tags: data.tags ? data.tags.map((tag) => tag.name) : [],
          relations: data.relations
            ? data.relations
                .filter((rel) => rel.target)
                .map((rel) => {
                  return {
                    targetId: rel.target!.id.toString(),
                    relationType: rel.relationType,
                  };
                })
            : [],
        }}
      />
    </div>
  );
}
