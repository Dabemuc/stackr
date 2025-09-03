import { relations } from "@/db/schema";
import { Tx } from "./Tx";
import { and, eq } from "drizzle-orm";
import { ComponentRelation } from "@/db/types";

export async function syncRelations(
  tx: Tx,
  compId: number,
  rels: { targetId: string; relationType: ComponentRelation }[], // 👈 fix
) {
  const desired = rels.map((r) => ({
    relationType: r.relationType, // now correctly typed
    sourceId: compId,
    targetId: Number(r.targetId),
  }));

  const desiredKey = (x: {
    relationType: ComponentRelation;
    targetId: number;
  }) => `${x.relationType}:${x.targetId}`;
  const desiredMap = new Map<
    string,
    { relationType: ComponentRelation; targetId: number; sourceId: number }
  >();
  for (const d of desired) desiredMap.set(desiredKey(d), d);

  const current = await tx
    .select({
      relationType: relations.relationType,
      targetId: relations.targetId,
    })
    .from(relations)
    .where(eq(relations.sourceId, compId));

  const currentKeys = new Set(
    current.map((r) => `${r.relationType}:${r.targetId}`),
  );
  const desiredKeys = new Set(Array.from(desiredMap.keys()));

  const toDelete = current.filter(
    (c) => !desiredKeys.has(`${c.relationType}:${c.targetId}`),
  );
  for (const d of toDelete) {
    await tx
      .delete(relations)
      .where(
        and(
          eq(relations.sourceId, compId),
          eq(relations.targetId, d.targetId),
          eq(relations.relationType, d.relationType),
        ),
      );
  }

  const toInsert = Array.from(desiredMap.values()).filter(
    (d) => !currentKeys.has(desiredKey(d)),
  );
  if (toInsert.length > 0) {
    await tx.insert(relations).values(toInsert);
  }
}
