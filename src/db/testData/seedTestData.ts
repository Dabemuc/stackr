import {
  components,
  tags,
  types,
  componentsTags,
  componentsTypes,
  relations,
} from "@/db/schema";
import {
  tagsData,
  typesData,
  componentsData,
  relationsData,
  componentsTagsLinks,
  componentsTypesLinks,
} from "./testData";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

export async function seed(
  db: NeonDatabase<Record<string, never>> & { $client: Pool },
) {
  if (process.env.NODE_ENV !== "development") {
    console.error("❌ Seeding is only allowed in development mode!");
    process.exit(1);
  }

  console.log("🚨 Clearing database...");
  await db.delete(componentsTypes);
  await db.delete(componentsTags);
  await db.delete(relations);
  await db.delete(types);
  await db.delete(tags);
  await db.delete(components);

  console.log("🌱 Inserting tags...");
  const insertedTags = await db.insert(tags).values(tagsData).returning();
  const tagMap = Object.fromEntries(insertedTags.map((t) => [t.name, t.id]));

  console.log("🌱 Inserting types...");
  const insertedTypes = await db.insert(types).values(typesData).returning();
  const typeMap = Object.fromEntries(insertedTypes.map((t) => [t.name, t.id]));

  console.log("🌱 Inserting components...");
  const insertedComponents = await db
    .insert(components)
    .values(componentsData)
    .returning();
  const compMap = Object.fromEntries(
    insertedComponents.map((c) => [c.name, c.id]),
  );

  console.log("🔗 Linking tags to components...");
  await db.insert(componentsTags).values(
    componentsTagsLinks.flatMap(({ comp, tags }) =>
      tags.map((t) => ({
        componentId: compMap[comp],
        tagId: tagMap[t],
      })),
    ),
  );

  console.log("🔗 Linking types to components...");
  await db.insert(componentsTypes).values(
    componentsTypesLinks.flatMap(({ comp, types }) =>
      types.map((t) => ({
        componentId: compMap[comp],
        typeId: typeMap[t],
      })),
    ),
  );

  console.log("🔗 Inserting relations...");
  await db.insert(relations).values(
    relationsData.map((r) => ({
      sourceId: compMap[r.sourceName],
      targetId: compMap[r.targetName],
      relationType: r.relationType,
    })),
  );

  console.log("✅ Database seeded successfully!");
}
