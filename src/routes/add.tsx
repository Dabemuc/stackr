import ComponentForm, { ComponentFormData } from "@/components/ComponentForm";
import { insertComponent } from "@/db/db";
import { authStateFn } from "@/integrations/clerk/authStateFn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add")({
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => ({ userId: context.userId }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Component</h1>
      <ComponentForm
        handleSubmit={(submittedData: ComponentFormData) => {
          return new Promise(async (resolve) => {
            resolve(await insertComponent({ data: submittedData }));
          });
        }}
        defaultVals={{
          name: "",
          description: "",
          article: "",
          type: [],
          status: "Production-ready",
          links: [],
          tags: [],
          relations: [],
        }}
      />
    </div>
  );
}
