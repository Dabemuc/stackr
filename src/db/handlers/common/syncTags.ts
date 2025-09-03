import { componentsTags } from "@/db/schema";
import { Tx } from "./Tx";
import { upsertHierarchicalTag } from "./upsertHierarchicalTags";
import { and, eq, inArray } from "drizzle-orm";

export async function syncTags(tx: Tx, compId: number, tagPaths: string[]) {
  // Resolve (and create) tag ids for each path, dedupe
  const desiredIdsSet = new Set<number>();
  for (const raw of tagPaths) {
    const path = raw
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);
    if (path.length === 0) continue;
    const id = await upsertHierarchicalTag(tx, path);
    desiredIdsSet.add(id);
  }
  const desiredIds = Array.from(desiredIdsSet);

  // current tag ids
  const currentRows = await tx
    .select({ tagId: componentsTags.tagId })
    .from(componentsTags)
    .where(eq(componentsTags.componentId, compId));
  const currentIds = currentRows.map((r) => r.tagId);

  // diff
  const toDelete = currentIds.filter((id) => !desiredIdsSet.has(id));
  const toInsert = desiredIds.filter((id) => !currentIds.includes(id));

  if (toDelete.length > 0) {
    await tx
      .delete(componentsTags)
      .where(
        and(
          eq(componentsTags.componentId, compId),
          inArray(componentsTags.tagId, toDelete),
        ),
      );
  }

  if (toInsert.length > 0) {
    await tx
      .insert(componentsTags)
      .values(toInsert.map((id) => ({ componentId: compId, tagId: id })));
  }
}
