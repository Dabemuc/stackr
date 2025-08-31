import { useEffect, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { findComponentById } from "@/db/db";
import { FindComponentByIdResult } from "@/db/handlers/findComponentByIdHandler";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import LinkWithHoverCard from "@/components/common/LinkWithHoverCard";
import ReactMarkdown from "react-markdown";

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

  // ---- Group relations with direction awareness ----
  const groupedRelations = data.relations?.reduce<
    Record<string, typeof data.relations>
  >((acc, rel) => {
    if (rel.relationType === "Depends on") {
      if (rel.source) {
        // source depends on current entity
        if (!acc["Depended on by"]) acc["Depended on by"] = [];
        acc["Depended on by"].push(rel);
      } else if (rel.target) {
        // current entity depends on target
        if (!acc["Depends on"]) acc["Depends on"] = [];
        acc["Depends on"].push(rel);
      }
    } else if (rel.relationType === "Alternative to") {
      if (!acc["Alternative to"]) acc["Alternative to"] = [];
      acc["Alternative to"].push(rel);
    } else {
      if (!acc[rel.relationType]) acc[rel.relationType] = [];
      acc[rel.relationType].push(rel);
    }
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2 text-accent-gradiant-to/80">
          {data.name}
        </h1>
        {data.types?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {data.types.map((type) => (
              <Badge key={type.id} variant="secondary">
                {type.name}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content column */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <p className="text-lg text-muted-foreground">{data.description}</p>
          {/* Article */}
          {data.article ? <ReactMarkdown>{data.article}</ReactMarkdown> : null}
          {/* Relations */}
          {groupedRelations && (
            <div className="space-y-6">
              {Object.entries(groupedRelations).map(([type, rels]) => (
                <div key={type}>
                  <h2 className="text-xl font-semibold mb-2">{type}</h2>
                  <ul className="list-disc list-inside space-y-1 marker:text-accent-gradiant-to/80">
                    {rels.map((rel) => {
                      const entity = rel.source ?? rel.target; // always one or the other
                      if (!entity) return null;

                      return (
                        <li key={rel.id}>
                          <LinkWithHoverCard
                            to="/view"
                            search={{ id: entity.id }}
                            name={entity.name}
                            description={entity.description ?? ""}
                            status={entity.status}
                          />{" "}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Links */}
          <div>
            <h3 className="font-semibold mb-2">Links</h3>
            {data.links && data.links.length > 0 ? (
              <div className="space-y-1">
                {data.links.map((link, idx) => (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent-gradiant-from/90 hover:underline"
                    key={idx}
                  >
                    {link}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">No Links</p>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            {data.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="bg-bg">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">No Tags</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default RouteComponent;
