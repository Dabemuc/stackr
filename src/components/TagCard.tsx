import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GroupedByTypeJson } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import { cn } from "@/lib/utils";
import { matchStatusToColor } from "./utils/matchStatusToColor";
import { ComponentStatus } from "@/db/types";
import LinkWithHoverCard from "./common/LinkWithHoverCard";

type Props = {
  tag: {
    tagId: number;
    tagPath: string;
    types: GroupedByTypeJson[];
  };
};

export default function TagCard({ tag }: Props) {
  return (
    <Card className="relative rounded-2xl gap-1 shadow-custom bg-bg overflow-hidden border-t-highlight">
      <div className="top-0 w-full h-1/4 absolute bg-gradient-to-b from-highlight/15 to-transparent"></div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{tag.tagPath}</CardTitle>
      </CardHeader>

      <CardContent className="text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tag.types.map((type, i) => {
            const isLastOdd =
              i === tag.types.length - 1 && tag.types.length % 2 === 1;

            return (
              <div
                key={tag.tagPath + "-type-" + i}
                className={cn(
                  "border rounded-xl p-4 bg-bg-light",
                  isLastOdd && "md:col-span-2",
                )}
              >
                <p className="text-sm font-medium text-text-muted border-b pb-1 mb-2">
                  {type.type}
                </p>
                <ul className="space-y-2">
                  {type.components.map((component, j) => (
                    <li
                      key={tag.tagPath + "-" + type.type + "-component-" + j}
                      className="flex items-center justify-between hover:bg-bg-light-hover p-2 rounded-lg transition"
                    >
                      <LinkWithHoverCard
                        to="/view"
                        search={{ id: component.id }}
                        name={component.name}
                        description={component.description ?? ""}
                        status={component.status}
                        className="truncate"
                      />
                      <div
                        className={cn(
                          "rounded-full w-3 h-3 flex-shrink-0",
                          matchStatusToColor(
                            component.status as ComponentStatus,
                          ),
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
