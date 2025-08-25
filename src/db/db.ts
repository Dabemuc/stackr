import {
  components,
  componentsTags,
  componentsTypes,
  relations,
  tags,
  types,
} from "./schema";
import { createServerFn } from "@tanstack/react-start";
import { ComponentFormData } from "@/components/ComponentForm";
import { upsertHierarchicalTag } from "./db_helper";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { seed } from "./testData/seedTestData";
import { findComponentsGroupedByTagThenTypeHandler } from "./handlers/findComponentsGroupedByTagThenTypeHandler";

export const db = drizzle(process.env.DATABASE_URL!);

export const seedDb = createServerFn({ method: "POST" }).handler(async () => {
  console.log("🌱 Running seed data...");
  await seed(db);
  console.log("✅ Seed complete!");
});

export const insertComponent = createServerFn({ method: "POST" })
  .validator((component: ComponentFormData) => component)
  .handler(async (ctx) => {
    console.log("Inserting component", ctx.data);
    const result = await db.transaction(async (tx) => {
      // Insert component
      const compId = await tx
        .insert(components)
        .values({
          name: ctx.data.name,
          status: ctx.data.status!,
          description: ctx.data.description,
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
  });

export const findComponents = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Finding Components");
    const result = await db.select().from(components);
    console.log("Found", result.length, "components");
    return result;
  },
);

export const findComponentsGroupedByTag = createServerFn({
  method: "GET",
}).handler(findComponentsGroupedByTagThenTypeHandler);

export const findTags = createServerFn({ method: "GET" }).handler(async () => {
  console.log("Finding Tags");
  const result = await db.select().from(tags);
  console.log("Found", result.length, "tags");
  return result;
});

export const findHierarchicalTags = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log("Finding hierarchical tags");
    const result = await db.execute(sql`
    WITH RECURSIVE tag_paths AS (
      SELECT
        id,
        name,
        parent_tag_id,
        name::text AS path
      FROM tags
      WHERE parent_tag_id IS NULL

      UNION ALL

      SELECT
        t.id,
        t.name,
        t.parent_tag_id,
        (tp.path || '/' || t.name) AS path
      FROM tags t
      JOIN tag_paths tp ON tp.id = t.parent_tag_id
    )
    SELECT id, name, path FROM tag_paths
    ORDER BY path;
  `);

    console.log("Found", result.rows.length, "hierarchical tags");
    return result.rows as { id: number; name: string; path: string }[];
  },
);

export const findTypes = createServerFn({ method: "GET" }).handler(async () => {
  console.log("Finding types");
  const result = await db.select().from(types);
  console.log("Found", result.length, "types");
  return result;
});
