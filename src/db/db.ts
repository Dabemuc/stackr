import { components, tags, types } from "./schema";
import { createServerFn } from "@tanstack/react-start";
import { ComponentFormData } from "@/components/ComponentForm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { seed } from "./testData/seedTestData";
import { findComponentsGroupedByTagThenTypeHandler } from "./handlers/findComponentsGroupedByTagThenTypeHandler";
import { insertComponentHandler } from "./handlers/insertComponentHandler";
import { findComponentByIdHandler } from "./handlers/findComponentByIdHandler";

export const db = drizzle(process.env.DATABASE_URL!);

export const seedDb = createServerFn({ method: "POST" }).handler(async () => {
  console.log("🌱 Running seed data...");
  await seed(db);
  console.log("✅ Seed complete!");
});

export const insertComponent = createServerFn({ method: "POST" })
  .validator((component: ComponentFormData) => component)
  .handler(async (ctx) => {
    const { requireAuth } = await import(
      "@/integrations/clerk/requireAuth.server"
    );
    await requireAuth({ mode: "api" });
    return insertComponentHandler(ctx);
  });

export const findComponentById = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(findComponentByIdHandler);

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
