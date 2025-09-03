import { componentsTypes, types } from "@/db/schema";
import { Tx } from "./Tx";
import { and, eq, inArray } from "drizzle-orm";

export async function syncTypes(
  tx: Tx,
  compId: number,
  typesInput: { id: number | null; name: string }[],
) {
  // Desired explicit ids from input (existing types)
  const explicitIds = typesInput.filter((t) => t.id !== null).map((t) => t.id!);

  // Names that need resolution (id === null)
  const namesToResolveSet = new Set(
    typesInput
      .filter((t) => t.id === null && t.name.trim() !== "")
      .map((t) => t.name.trim()),
  );
  const namesToResolve = Array.from(namesToResolveSet);

  // Fetch existing types for those names
  let existing: { id: number; name: string }[] = [];
  if (namesToResolve.length > 0) {
    existing = await tx
      .select({ id: types.id, name: types.name })
      .from(types)
      .where(inArray(types.name, namesToResolve));
  }

  const existingNameToId = new Map(existing.map((e) => [e.name, e.id]));

  // Determine which names actually still need to be created
  const namesToCreate = namesToResolve.filter((n) => !existingNameToId.has(n));

  // Insert missing names (if any) and get their ids
  let created: { id: number; name: string }[] = [];
  if (namesToCreate.length > 0) {
    // Single bulk insert of missing names
    created = await tx
      .insert(types)
      .values(namesToCreate.map((n) => ({ name: n })))
      .returning({ id: types.id, name: types.name });
  }

  // Build name -> id map for resolved names
  for (const c of created) existingNameToId.set(c.name, c.id);

  // Build final desired type ids
  const resolvedIdsFromNames = namesToResolve
    .map((n) => existingNameToId.get(n))
    .filter((id): id is number => typeof id === "number");

  const desiredTypeIds = Array.from(
    new Set([...explicitIds, ...resolvedIdsFromNames]),
  );

  // current join rows
  const currentRows = await tx
    .select({ typeId: componentsTypes.typeId })
    .from(componentsTypes)
    .where(eq(componentsTypes.componentId, compId));
  const currentIds = currentRows.map((r) => r.typeId);

  const toDelete = currentIds.filter((id) => !desiredTypeIds.includes(id));
  const toInsert = desiredTypeIds.filter((id) => !currentIds.includes(id));

  if (toDelete.length > 0) {
    await tx
      .delete(componentsTypes)
      .where(
        and(
          eq(componentsTypes.componentId, compId),
          inArray(componentsTypes.typeId, toDelete),
        ),
      );
  }

  if (toInsert.length > 0) {
    await tx
      .insert(componentsTypes)
      .values(toInsert.map((id) => ({ componentId: compId, typeId: id })));
  }
}
