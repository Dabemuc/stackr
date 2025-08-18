import { tags } from "./schema";
import { and, eq, ExtractTablesWithRelations, isNull } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";

export async function upsertHierarchicalTag(
  tx: PgTransaction<
    NeonQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
  path: string[],
) {
  let parentId: number | null = null;

  for (const name of path) {
    // Check if tag exists under this parent
    const existing = await tx
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.name, name),
          parentId === null
            ? isNull(tags.parentTagId)
            : eq(tags.parentTagId, parentId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      parentId = existing[0].id;
      continue;
    }

    // Insert if not found
    const inserted: { id: number }[] = await tx
      .insert(tags)
      .values({ name, parentTagId: parentId })
      .returning({ id: tags.id });

    parentId = inserted[0].id;
  }

  if (!parentId)
    throw new Error(
      "Received null value when trying to upsert tag into db. Tag parts: " +
        path,
    );

  return parentId; // returns id of the deepest tag
}
