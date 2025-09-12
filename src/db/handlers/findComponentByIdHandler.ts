import { db } from "../db";
import { ServerFnCtx } from "@tanstack/react-start";
import fetchComponentFull from "./common/fetchComponentFull";
import { Tx } from "./common/Tx";

export const findComponentByIdHandler = async (
  ctx: ServerFnCtx<"GET", "data", undefined, (id: number) => number>,
) => {
  const componentId = ctx.data;

  const fetched = await db.transaction(async (tx: Tx) => {
    return await fetchComponentFull(componentId, tx);
  });
  if (!fetched) return null;
  const { component, tagRows, typeRows, relationRowsRaw } = fetched;

  // --- Strip out redundant side
  const relationRows = relationRowsRaw.map((rel) => {
    if (rel.source.id === componentId) {
      return {
        id: rel.id,
        relationType: rel.relationType,
        target: rel.target,
        updated_at: rel.updated_at,
      };
    } else {
      return {
        id: rel.id,
        relationType: rel.relationType,
        source: rel.source,
        updated_at: rel.updated_at,
      };
    }
  });

  // --- Collect updated_at values
  const updatedAts: Date[] = [
    component.updated_at,
    ...tagRows.map((t) => t.updated_at),
    ...typeRows.map((t) => t.updated_at),
    ...relationRows.map((r) => r.updated_at),
    ...relationRows.map((r) =>
      r.source ? r.source.updated_at : r.target.updated_at,
    ),
  ].filter(Boolean) as Date[];

  const mostRecentUpdatedAt =
    updatedAts.length > 0
      ? new Date(Math.max(...updatedAts.map((d) => +d)))
      : null;

  const result = {
    ...component,
    tags: tagRows,
    types: typeRows,
    relations: relationRows,
    most_recent_update: mostRecentUpdatedAt,
  };

  return result;
};

// infer return type
export type FindComponentByIdResult = Awaited<
  ReturnType<typeof findComponentByIdHandler>
>;
