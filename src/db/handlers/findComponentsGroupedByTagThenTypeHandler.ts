import { tags } from "@/db/schema";
import { sql } from "drizzle-orm";
import { db } from "../db";

export type ComponentJson = {
  id: number;
  name: string;
  description: string | null;
  links: string[] | null;
  status: string;
};

export type GroupedByTypeJson = {
  type: string;
  components: ComponentJson[];
};

export const findComponentsGroupedByTagThenTypeHandler = async () => {
  const result = await db
    .select({
      tagId: tags.id,
      tagName: tags.name,
      parentTagId: tags.parentTagId,
      types: sql<GroupedByTypeJson[]> /*sql*/ `
        COALESCE(
          json_agg(
            json_build_object(
              'type', comp_group.type,
              'components', comp_group.components
            )
          ) FILTER (WHERE comp_group.type IS NOT NULL),
          '[]'
        )
      `.as("types"),
    })
    .from(tags)
    .leftJoin(
      sql /*sql*/ `
        (
          SELECT ct.tag_id,
                 t.name as type,
                 json_agg(
                   json_build_object(
                     'id', c.id,
                     'name', c.name,
                     'description', c.description,
                     'links', c.links,
                     'status', c.status
                   )
                   ORDER BY c.name
                 ) as components
          FROM components_tags ct
          JOIN components c ON c.id = ct.component_id
          JOIN components_types ctt ON ctt.component_id = c.id
          JOIN types t ON t.id = ctt.type_id
          GROUP BY ct.tag_id, t.name
        ) comp_group
      `,
      sql`comp_group.tag_id = ${tags.id}`,
    )
    .groupBy(tags.id);

  return result;
};

// infer return type
export type FindComponentsGroupedByTagThenTypeResult = Awaited<
  ReturnType<typeof findComponentsGroupedByTagThenTypeHandler>
>;
