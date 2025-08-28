import { useEffect, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { findComponentById } from "@/db/db";
import { FindComponentByIdResult } from "@/db/handlers/findComponentByIdHandler";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/view")({
  validateSearch: (search) => ({
    id: search.id ? Number(search.id) : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const routeSearch = useSearch({ from: "/view" });
  const [data, setData] = useState<FindComponentByIdResult>();

  useEffect(() => {
    async function fetchData() {
      if (routeSearch.id) {
        setData(await findComponentById({ data: routeSearch.id }));
      }
    }
    fetchData();
  }, [routeSearch.id]);

  if (!data) return <p className="p-4 text-muted-foreground">Loading...</p>;

  // Group relations by relationType
  const groupedRelations = data.relations?.reduce<
    Record<string, typeof data.relations>
  >((acc, rel) => {
    if (!acc[rel.relationType]) acc[rel.relationType] = [];
    acc[rel.relationType].push(rel);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
        {data.types?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {data.types.map((type) => (
              <Badge key={type.id} variant="secondary">
                {type.name}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-lg text-muted-foreground">{data.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content column */}
        <div className="md:col-span-2 space-y-6">
          {/* Relations */}
          {groupedRelations && (
            <div className="space-y-6">
              {Object.entries(groupedRelations).map(([type, rels]) => (
                <div key={type}>
                  <h2 className="text-xl font-semibold mb-2">{type}</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {rels.map((rel) => (
                      <li key={rel.id}>
                        <span className="text-muted-foreground">
                          {rel.target?.name ?? "Unknown"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Links */}
          {data.links
            ? data.links?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Links</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {data.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          {link}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            : null}

          <Separator />

          {/* Tags */}
          {data.tags?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default RouteComponent;
