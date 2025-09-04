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
import { Tx } from "./Tx";

export default async function fetchComponentFull(componentId: number, tx: Tx) {
  // --- Fetch base component
  const [component] = await tx
    .select()
    .from(components)
    .where(eq(components.id, componentId));

  if (!component) return null;

  // --- Fetch tags
  const tagRows = await tx
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
  const typeRows = await tx
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
  const relationRowsRaw = await tx
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

  return { component, tagRows, typeRows, relationRowsRaw };
}
