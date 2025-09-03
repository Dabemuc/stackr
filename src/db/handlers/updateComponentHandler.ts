import { db } from "../db";
import { ServerFnCtx } from "@tanstack/react-start";
import { ComponentFormData } from "@/components/ComponentForm";
import { Tx } from "./common/Tx";
import { components } from "../schema";
import { syncTags } from "./common/syncTags";
import { syncTypes } from "./common/syncTypes";
import { syncRelations } from "./common/syncRelations";
import { eq } from "drizzle-orm";

export const updateComponentHandler = async (
  ctx: ServerFnCtx<
    "POST",
    "data",
    undefined,
    (
      component: ComponentFormData & { id: number },
    ) => ComponentFormData & { id: number }
  >,
): Promise<{ success: boolean; id?: number; error?: string }> => {
  try {
    const comp = ctx.data;

    await db.transaction(async (tx: Tx) => {
      console.log(comp);
      // update component row
      const updateData = {
        name: comp.name,
        status: comp.status!,
        description: comp.description,
        article: comp.article,
        links: comp.links,
      };

      await tx
        .update(components)
        .set(updateData)
        .where(eq(components.id, comp.id));

      console.log(comp);
      // sync associations (only change what's needed)
      await syncTags(tx, comp.id, comp.tags);
      await syncTypes(tx, comp.id, comp.type);
      await syncRelations(tx, comp.id, comp.relations);
    });

    return { success: true, id: comp.id };
  } catch (err: any) {
    console.error(
      "Error while updating component with id",
      ctx.data.id,
      ": \n",
      err,
    );
    return { success: false, error: "Failed to update component" };
  }
};

// infer return type
export type UpdateComponentResult = Awaited<
  ReturnType<typeof updateComponentHandler>
>;
