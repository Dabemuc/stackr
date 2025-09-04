import { db } from "../db";
import { ServerFnCtx } from "@tanstack/react-start";
import { Tx } from "./common/Tx";
import fetchComponentFull from "./common/fetchComponentFull";
import { ComponentUpdateType } from "../validators/zodSchemas";
import buildUpdateStoredDiff, {
  DiffResult,
} from "./common/buildUpdateStoredDiff";
import { eq, and } from "drizzle-orm";
import {
  components,
  tags,
  componentsTags,
  types,
  componentsTypes,
  relations,
} from "@/db/schema";
import util from "util";
import { upsertHierarchicalTag } from "./common/upsertHierarchicalTags";

export const updateComponentHandler = async (
  ctx: ServerFnCtx<
    "POST",
    "data",
    undefined,
    (component: ComponentUpdateType) => ComponentUpdateType
  >,
): Promise<{ success: boolean; id?: number; error?: string }> => {
  let stage: "idle" | "fetch stored" | "diff" | "update" | "done" = "idle";
  const comp = ctx.data;
  try {
    await db.transaction(async (tx: Tx) => {
      // Get stored data
      stage = "fetch stored";
      const stored = await fetchComponentFull(comp.id, tx);
      if (!stored) throw new Error("Component to update does not exist!");

      // Build diff
      stage = "diff";
      const diff = buildUpdateStoredDiff(comp, stored);

      // Perform updates
      stage = "update";
      await performUpdate(diff, tx, comp.id);
    });

    return { success: true, id: comp.id };
  } catch (err: any) {
    console.error(
      "Error while updating component with id",
      comp.id,
      " in stage:",
      stage,
      "\nData:",
      comp,
      "\nError:",
      err,
    );
    return { success: false, error: "Failed to update component" };
  }
};

// infer return type
export type UpdateComponentResult = Awaited<
  ReturnType<typeof updateComponentHandler>
>;

// Helper to perform an update based on computed diff
export async function performUpdate(
  diff: DiffResult,
  tx: Tx,
  componentId: number,
) {
  // Component fields
  const updates: Record<string, any> = {};
  for (const d of diff.component) {
    if (d.action === "Update" && d.field) {
      updates[d.field] = d.after;
    }
  }

  if (Object.keys(updates).length > 0) {
    await tx
      .update(components)
      .set(updates)
      .where(eq(components.id, componentId));
  }

  // Tags (only manage relation)
  for (const d of diff.tags) {
    if (d.action === "Create" && d.after) {
      // const [tag] = await tx
      //   .insert(tags)
      //   .values({
      //     name: d.after.name,
      //     parentTagId: d.after.parentTagId ?? null,
      //   })
      //   .onConflictDoNothing({ target: [tags.name, tags.parentTagId] })
      //   .returning();
      //
      // const tagId =
      //   tag?.id ??
      //   (
      //     await tx
      //       .select()
      //       .from(tags)
      //       .where(
      //         and(
      //           eq(tags.name, d.after.name),
      //           eq(tags.parentTagId, d.after.parentTagId ?? null),
      //         ),
      //       )
      //   )[0].id;

      // Insert new tag and get id or get id of existing
      const tagId = await upsertHierarchicalTag(tx, d.after.name.split("/"));

      await tx
        .insert(componentsTags)
        .values({ componentId, tagId })
        .onConflictDoNothing();
    }

    if (d.action === "Delete" && d.before) {
      await tx
        .delete(componentsTags)
        .where(
          and(
            eq(componentsTags.componentId, componentId),
            eq(componentsTags.tagId, d.before.id),
          ),
        );
    }
  }

  // Types (only manage relation)
  for (const d of diff.types) {
    if (d.action === "Create" && d.after) {
      const [type] = await tx
        .insert(types)
        .values({ name: d.after.name })
        .onConflictDoNothing({ target: types.name })
        .returning();

      const typeId =
        type?.id ??
        (await tx.select().from(types).where(eq(types.name, d.after.name)))[0]
          .id;

      await tx
        .insert(componentsTypes)
        .values({ componentId, typeId })
        .onConflictDoNothing();
    }

    if (d.action === "Delete" && d.before) {
      await tx
        .delete(componentsTypes)
        .where(
          and(
            eq(componentsTypes.componentId, componentId),
            eq(componentsTypes.typeId, d.before.id),
          ),
        );
    }
  }

  // Relations (full row lifecycle is fine)
  for (const d of diff.relations) {
    if (d.action === "Create" && d.after) {
      await tx
        .insert(relations)
        .values({
          sourceId: componentId,
          targetId: Number(d.after.targetId),
          relationType: d.after.relationType,
        })
        .onConflictDoNothing();
    }

    if (d.action === "Delete" && d.before) {
      await tx.delete(relations).where(eq(relations.id, d.before.id));
    }
  }
}
