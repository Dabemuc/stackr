import { Link } from "@tanstack/react-router";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import { HoverCardContent } from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

export default function LinkWithHoverCard({
  to,
  search,
  name,
  description,
  status,
  className,
}: {
  to: string;
  search: any;
  name: string;
  description: string;
  status: string;
  className?: string;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={to}
          search={search}
          className={cn(
            "text-accent-foreground hover:underline font-medium",
            className,
          )}
        >
          {name}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 max-h-96 bg-bg bg-gradient-to-br from-accent-gradiant-to/10 via-bg to-bg rounded-2xl p-4 border-custom-border border shadow-custom z-10">
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <Link
              to={to}
              search={search}
              className="text-sm font-semibold hover:underline text-accent-gradiant-to"
            >
              {name}
            </Link>

            <p className="text-sm overflow-scroll">{description}</p>
            <div className="text-muted-foreground text-xs">{status}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
