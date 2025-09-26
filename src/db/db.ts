import { components, tags, types } from "./schema";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { seed } from "./testData/seedTestData";
import { findComponentsGroupedByTagThenTypeHandler } from "./handlers/findComponentsGroupedByTagThenTypeHandler";
import { insertComponentHandler } from "./handlers/insertComponentHandler";
import { findComponentByIdHandler } from "./handlers/findComponentByIdHandler";
import { updateComponentHandler } from "./handlers/updateComponentHandler";
import insertComponentValidator from "./validators/insertComponentValidator";
import updateComponentValidator from "./validators/updateComponentValidator";
import { logger } from "@/logging/logger";
import { getCacheConf } from "./cache";

export const db = drizzle(process.env.DATABASE_URL!, {
  cache: await getCacheConf(),
});

export const seedDb = createServerFn({ method: "POST" }).handler(async () => {
  logger.info("🌱 Running seed data...");
  await seed(db);
  logger.info("✅ Seed complete!");
});

export const insertComponent = createServerFn({ method: "POST" })
  .validator(insertComponentValidator)
  .handler(async (ctx) => {
    logger.info("insertComponent ServerFn called. Context:", ctx);
    const { requireAuth } = await import(
      "@/integrations/clerk/requireAuth.server"
    );
    await requireAuth({ mode: "api", role: "admin" });
    return insertComponentHandler(ctx);
  });

export const updateComponent = createServerFn({ method: "POST" })
  .validator(updateComponentValidator)
  .handler(async (ctx) => {
    logger.info("updateComponent ServerFn called. Context:", ctx);
    const { requireAuth } = await import(
      "@/integrations/clerk/requireAuth.server"
    );
    await requireAuth({ mode: "api", role: "admin" });
    return updateComponentHandler(ctx);
  });

export const findComponentById = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async (ctx) => {
    logger.info("findComponentById ServerFn called. Context:", ctx);
    return findComponentByIdHandler(ctx);
  });

export const findComponents = createServerFn({ method: "GET" }).handler(
  async () => {
    logger.info("findComponents ServerFn called");
    const result = await db.select().from(components);
    logger.info("Found", result.length, "components");
    return result;
  },
);

export const findComponentsGroupedByTag = createServerFn({
  method: "GET",
}).handler(async () => {
  logger.info("findComponentsGroupedByTag ServerFn called");
  return findComponentsGroupedByTagThenTypeHandler();
});

export const findTags = createServerFn({ method: "GET" }).handler(async () => {
  logger.info("findTags ServerFn called");
  const result = await db.select().from(tags);
  logger.info("Found", result.length, "tags");
  return result;
});

export const findHierarchicalTags = createServerFn({ method: "GET" }).handler(
  async () => {
    logger.info("findHierarchicalTags ServerFn called");
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

    logger.info("Found", result.rows.length, "hierarchical tags");
    return result.rows as { id: number; name: string; path: string }[];
  },
);

export const findTypes = createServerFn({ method: "GET" }).handler(async () => {
  logger.info("findTypes ServerFn called");
  const result = await db.select().from(types);
  logger.info("Found", result.length, "types");
  return result;
});
