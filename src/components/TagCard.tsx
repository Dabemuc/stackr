import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GroupedByTypeJson } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import { cn } from "@/lib/utils";
import { matchStatusToColor } from "./utils/matchStatusToColor";
import { ComponentStatus } from "@/db/types";

type Props = {
  tag: {
    tagId: number;
    tagName: string;
    parentTagId: number | null;
    types: GroupedByTypeJson[];
  };
};

export default function TagCard({ tag }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tag.tagName}</CardTitle>
      </CardHeader>
      <CardContent className="text-left">
        <ul>
          {tag.types.map((type, i) => (
            <li key={tag.tagName + "-type-" + i} className="pt-4">
              <p>{type.type}</p>
              <ul className="pl-4">
                {type.components.map((component, j) => (
                  <li key={tag.tagName + "-" + type.type + "-component-" + j}>
                    <div className="flex items-center gap-2">
                      <Link to={"/view?id=" + component.id} className="z-1">
                        {component.name}
                      </Link>
                      <div
                        className={cn(
                          "rounded-full size-2",
                          matchStatusToColor(
                            component.status as ComponentStatus,
                          ),
                        )}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
