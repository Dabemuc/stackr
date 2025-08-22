import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GroupedByTypeJson } from "@/db/handlers/findComponentsGroupedByTagThenTypeHandler";
import { cn } from "@/lib/utils";
import { matchStatusToColor } from "./utils/matchStatusToColor";
import { ComponentStatus } from "@/db/types";
import { HoverCard, HoverCardTrigger } from "./ui/hover-card";
import { HoverCardContent } from "@radix-ui/react-hover-card";
import { components } from "@/db/schema";

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
    <Card className="relative rounded-2xl shadow-custom bg-bg overflow-hidden border-t-highlight">
      <div className="top-0 w-full h-1/3 absolute bg-gradient-to-b from-highlight/20 to-transparent"></div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-text">
          {tag.tagName}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-left space-y-4">
        {tag.types.map((type, i) => (
          <div key={tag.tagName + "-type-" + i}>
            <p className="text-sm font-medium text-text-muted border-b pb-1 mb-2">
              {type.type}
            </p>
            <ul className="space-y-2">
              {type.components.map((component, j) => (
                <li
                  key={tag.tagName + "-" + type.type + "-component-" + j}
                  className="flex items-center justify-between bg-bg-light hover:bg-bg-light-hover p-2 rounded-lg transition"
                >
                  <HoverCard>
                    <HoverCardTrigger>
                      <Link
                        to={"/view?id=" + component.id}
                        className="text-accent-foreground hover:underline font-medium"
                      >
                        {component.name}
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-h-96 bg-bg rounded-2xl p-4 border-custom-border border z-10">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                          <Link
                            to={"/view?id=" + component.id}
                            className="text-sm font-semibold hover:underline"
                          >
                            {component.name}
                          </Link>

                          <p className="text-sm overflow-scroll">
                            {component.description}
                          </p>
                          <div className="text-muted-foreground text-xs">
                            {component.status}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <div
                    className={cn(
                      "rounded-full w-3 h-3",
                      matchStatusToColor(component.status as ComponentStatus),
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
