import { TanstackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import { seedDb } from "@/db/db";

export function DevtoolsWrapper() {
  return (
    <TanstackDevtools
      config={{ position: "bottom-left" }}
      plugins={[
        { name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
        {
          name: "Stackr DevTools",
          render: (
            <div className="p-3">
              <Button onClick={() => seedDb()}>Seed db</Button>
            </div>
          ),
        },
      ]}
    />
  );
}
