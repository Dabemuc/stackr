import { components, tags, componentsTags, relations } from "@/db/schema";
import { tagsData, componentsData, relationsData } from "./testData";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

export async function seed(
  db: NeonDatabase<Record<string, never>> & {
    $client: Pool;
  },
) {
  if (process.env.NODE_ENV !== "development") {
    console.error("❌ Seeding is only allowed in development mode!");
    process.exit(1);
  }

  console.log("🚨 Clearing database...");
  await db.delete(componentsTags);
  await db.delete(relations);
  await db.delete(tags);
  await db.delete(components);

  console.log("🌱 Inserting tags...");
  const insertedTags = await db.insert(tags).values(tagsData).returning();
  const tagMap = Object.fromEntries(insertedTags.map((t) => [t.name, t.id]));

  console.log("🌱 Inserting components...");
  const insertedComponents = await db
    .insert(components)
    .values(componentsData)
    .returning();
  const compMap = Object.fromEntries(
    insertedComponents.map((c) => [c.name, c.id]),
  );

  console.log("🔗 Linking tags to components...");
  const tagLinks = [
    { comp: "React", tags: ["UI"] },
    { comp: "Next.js", tags: ["UI", "Authentication"] },
    { comp: "Angular", tags: ["UI"] },
    { comp: "Vue.js", tags: ["UI"] },
    { comp: "PostgreSQL", tags: ["Cloud"] },
    { comp: "MongoDB", tags: ["Cloud"] },
    { comp: "Prisma", tags: ["ORM"] },
    { comp: "TypeORM", tags: ["ORM"] },
    { comp: "Firebase Auth", tags: ["Authentication"] },
    { comp: "Supabase", tags: ["Cloud", "Authentication"] },
    { comp: "Auth0", tags: ["Authentication"] },
    { comp: "Jest", tags: ["Testing"] },
    { comp: "Playwright", tags: ["Testing"] },
    { comp: "Docker", tags: ["DevOps"] },
    { comp: "Kubernetes", tags: ["DevOps"] },
    { comp: "Stripe API", tags: ["API"] },
    { comp: "Segment", tags: ["Analytics"] },
    { comp: "GitHub Actions", tags: ["CI/CD"] },
    { comp: "CircleCI", tags: ["CI/CD"] },
    { comp: "Terraform", tags: ["DevOps"] },
  ];

  await db.insert(componentsTags).values(
    tagLinks.flatMap(({ comp, tags }) =>
      tags.map((t) => ({
        componentId: compMap[comp],
        tagId: tagMap[t],
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
