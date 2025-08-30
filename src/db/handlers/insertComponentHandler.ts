import {
  components,
  componentsTags,
  componentsTypes,
  relations,
  types,
} from "../schema";
import { upsertHierarchicalTag } from "../db_helper";
import { db } from "../db";
import { ServerFnCtx } from "@tanstack/react-start";
import { ComponentFormData } from "@/components/ComponentForm";

export const insertComponentHandler = async (
  ctx: ServerFnCtx<
    "POST",
    "data",
    undefined,
    (component: ComponentFormData) => ComponentFormData
  >,
) => {
  console.log("Inserting component", ctx.data);
  const result = await db.transaction(async (tx) => {
    // Insert component
    const compId = await tx
      .insert(components)
      .values({
        name: ctx.data.name,
        status: ctx.data.status!,
        description: ctx.data.description,
        article: ctx.data.article,
        links: ctx.data.links,
      })
      .returning({ id: components.id });
    // Insert new tags and get tag ids
    const tagIds = [];
    for (const tag of ctx.data.tags) {
      // Split on '/' and upsert
      tagIds.push(await upsertHierarchicalTag(tx, tag.split("/")));
    }
    // Insert componentsTags
    for (const tagId of tagIds) {
      await tx.insert(componentsTags).values({
        componentId: compId[0].id,
        tagId: tagId,
      });
    }
    // Insert new types and get their ids
    const newTypes = ctx.data.type
      .filter((type) => type.id === null)
      .map((type) => ({ name: type.name }));
    let newTypeIds: { id: number }[] = [];
    if (newTypes.length > 0) {
      newTypeIds = await tx
        .insert(types)
        .values(newTypes)
        .returning({ id: types.id }); // <-- fixed
    }
    // Insert componentsTypes
    const compTypes = [
      ...newTypeIds.map(({ id }) => ({
        componentId: compId[0].id,
        typeId: id,
      })),
      ...ctx.data.type
        .filter((type) => type.id !== null)
        .map((type) => ({
          componentId: compId[0].id,
          typeId: type.id!,
        })),
    ];
    if (compTypes.length > 0) {
      await tx.insert(componentsTypes).values(compTypes);
    }
    // Insert relations
    for (const rel of ctx.data.relations) {
      await tx.insert(relations).values({
        relationType: rel.relationType,
        sourceId: compId[0].id,
        targetId: Number(rel.targetId),
      });
    }
  });
  return result;
};

// infer return type
export type InsertComponentResult = Awaited<
  ReturnType<typeof insertComponentHandler>
>;
