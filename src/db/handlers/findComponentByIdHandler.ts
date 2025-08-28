import { db } from "../db";
import { ServerFnCtx } from "@tanstack/react-start";
import {
  components,
  componentsTags,
  tags,
  componentsTypes,
  types,
  relations,
} from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const findComponentByIdHandler = async (
  ctx: ServerFnCtx<"GET", "data", undefined, (id: number) => number>,
) => {
  const componentId = ctx.data;
  console.log("Finding component with id:", componentId);

  // --- Fetch base component
  const [component] = await db
    .select()
    .from(components)
    .where(eq(components.id, componentId));

  if (!component) return null;

  // --- Fetch tags
  const tagRows = await db
    .select({
      id: tags.id,
      name: tags.name,
      parentTagId: tags.parentTagId,
    })
    .from(componentsTags)
    .innerJoin(tags, eq(componentsTags.tagId, tags.id))
    .where(eq(componentsTags.componentId, componentId));

  // --- Fetch types
  const typeRows = await db
    .select({
      id: types.id,
      name: types.name,
    })
    .from(componentsTypes)
    .innerJoin(types, eq(componentsTypes.typeId, types.id))
    .where(eq(componentsTypes.componentId, componentId));

  // --- Create aliases for self-join
  const sourceComponent = alias(components, "source");
  const targetComponent = alias(components, "target");

  // --- Fetch relations + both sides
  const relationRowsRaw = await db
    .select({
      id: relations.id,
      relationType: relations.relationType,

      source: {
        id: sourceComponent.id,
        name: sourceComponent.name,
        description: sourceComponent.description,
        links: sourceComponent.links,
        status: sourceComponent.status,
      },

      target: {
        id: targetComponent.id,
        name: targetComponent.name,
        description: targetComponent.description,
        links: targetComponent.links,
        status: targetComponent.status,
      },
    })
    .from(relations)
    .innerJoin(sourceComponent, eq(relations.sourceId, sourceComponent.id))
    .innerJoin(targetComponent, eq(relations.targetId, targetComponent.id))
    .where(
      or(
        eq(relations.sourceId, componentId),
        eq(relations.targetId, componentId),
      ),
    );

  // --- Strip out redundant side
  const relationRows = relationRowsRaw.map((rel) => {
    if (rel.source.id === componentId) {
      // main component is the source → keep only target
      return {
        id: rel.id,
        relationType: rel.relationType,
        target: rel.target,
      };
    } else {
      // main component is the target → keep only source
      return {
        id: rel.id,
        relationType: rel.relationType,
        source: rel.source,
      };
    }
  });

  const result = {
    ...component,
    tags: tagRows,
    types: typeRows,
    relations: relationRows,
  };

  console.log("Found component with id", componentId, ":", result);

  return result;
};

// infer return type
export type FindComponentByIdResult = Awaited<
  ReturnType<typeof findComponentByIdHandler>
>;
