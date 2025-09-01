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
      updated_at: tags.updated_at,
    })
    .from(componentsTags)
    .innerJoin(tags, eq(componentsTags.tagId, tags.id))
    .where(eq(componentsTags.componentId, componentId));

  // --- Fetch types
  const typeRows = await db
    .select({
      id: types.id,
      name: types.name,
      updated_at: types.updated_at,
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
      updated_at: relations.updated_at,

      source: {
        id: sourceComponent.id,
        name: sourceComponent.name,
        description: sourceComponent.description,
        links: sourceComponent.links,
        status: sourceComponent.status,
        updated_at: sourceComponent.updated_at,
      },

      target: {
        id: targetComponent.id,
        name: targetComponent.name,
        description: targetComponent.description,
        links: targetComponent.links,
        status: targetComponent.status,
        updated_at: targetComponent.updated_at,
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
      return {
        id: rel.id,
        relationType: rel.relationType,
        target: rel.target,
        updated_at: rel.updated_at,
      };
    } else {
      return {
        id: rel.id,
        relationType: rel.relationType,
        source: rel.source,
        updated_at: rel.updated_at,
      };
    }
  });

  // --- Collect updated_at values
  const updatedAts: Date[] = [
    component.updated_at,
    ...tagRows.map((t) => t.updated_at),
    ...typeRows.map((t) => t.updated_at),
    ...relationRows.map((r) => r.updated_at),
    ...relationRows.map((r) =>
      r.source ? r.source.updated_at : r.target.updated_at,
    ),
  ].filter(Boolean) as Date[];

  const mostRecentUpdatedAt =
    updatedAts.length > 0
      ? new Date(Math.max(...updatedAts.map((d) => +d)))
      : null;

  const result = {
    ...component,
    tags: tagRows,
    types: typeRows,
    relations: relationRows,
    most_recent_update: mostRecentUpdatedAt,
  };

  console.log("Found component with id", componentId, ":", result);

  return result;
};

// infer return type
export type FindComponentByIdResult = Awaited<
  ReturnType<typeof findComponentByIdHandler>
>;
