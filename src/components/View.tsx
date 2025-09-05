import { findComponentById } from "@/db/db";
import { FindComponentByIdResult } from "@/db/handlers/findComponentByIdHandler";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { useSearch } from "@tanstack/react-router";
import { Pencil, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import LinkWithHoverCard from "./common/LinkWithHoverCard";
import { Button } from "./ui/button";
import { matchStatusToColor } from "./utils/matchStatusToColor";
import { Link } from "@tanstack/react-router";
import { Badge } from "./ui/badge";
import { ViewSkeleton } from "./skeletons/ViewSkeleton";
import { Separator } from "./ui/separator";
import CustomMdRenderer from "./md/CustomMdRenderer";

export default function View() {
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

  if (!data) return <ViewSkeleton />;

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
        <div className="flex gap-3 items-center justify-between">
          <h1 className="text-4xl font-bold mb-2 text-accent-gradiant-to/90">
            {data.name}
          </h1>
          <SignedIn>
            <Link to={"/edit"} search={{ id: data.id }} title="Edit">
              <Button
                variant="ghost"
                className="aspect-square hover:cursor-pointer"
                size="lg"
              >
                <Pencil className="scale-125" />
              </Button>
            </Link>
          </SignedIn>
        </div>
        {data.types?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {data.types.map((type) => (
              <Badge key={type.id} variant="secondary">
                <Link to={"/"} search={{ type: [type.name] }}>
                  {type.name}
                </Link>
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
          {data.article ? (
            <CustomMdRenderer>{data.article}</CustomMdRenderer>
          ) : null}
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
          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            {data.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="bg-bg">
                    <Link to={"/"} search={{ tag: [tag.id] }}>
                      {tag.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">No Tags</p>
            )}
          </div>

          <Separator />

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex items-center gap-3">
              <Link to={"/"} search={{ status: [data.status] }}>
                <Badge variant="outline">{data.status}</Badge>
              </Link>
              <div
                className={cn(
                  "rounded-full w-3 h-3 flex-shrink-0",
                  matchStatusToColor(data.status),
                )}
              />
            </div>
          </div>

          <Separator />

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

          {/* Last update */}
          <div>
            <h3 className="font-semibold mb-2">Last updated</h3>

            <p className="text-muted-foreground">
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(data.updated_at)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
