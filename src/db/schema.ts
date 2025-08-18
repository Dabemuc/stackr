import { ComponentRelation, ComponentStatus, ComponentType } from "@/db/types";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  unique,
  integer,
  varchar,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";

// ------------------ Components ------------------
export const components = pgTable(
  "components",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "components_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }).$type<ComponentType>().array().notNull(),
    description: text(),
    links: text().array(),
    status: varchar({ length: 255 }).$type<ComponentStatus>().notNull(),
  },
  (table) => [
    unique("components_name_unique").on(table.name),
    sql`CHECK (cardinality(${table.type}) > 0)`,
  ],
);

export type Component = InferSelectModel<typeof components>;
export type NewComponent = InferInsertModel<typeof components>;

// ------------------ Tags ------------------
export const tags = pgTable(
  "tags",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    parentTagId: integer("parent_tag_id").references((): any => tags.id, {
      onDelete: "set null",
    }),
  },
  // (table) => [unique("tags_name_unique").on(table.name)],
);

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

// ------------------ Components ↔ Tags (many-to-many) ------------------
export const componentsTags = pgTable(
  "components_tags",
  {
    componentId: integer("component_id")
      .notNull()
      .references(() => components.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.componentId, table.tagId] })],
);

// ------------------ Relations (component ↔ component) ------------------
export const relations = pgTable(
  "relations",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "relations_id_seq",
    }),
    sourceId: integer("source_id")
      .notNull()
      .references(() => components.id, { onDelete: "cascade" }),
    targetId: integer("target_id")
      .notNull()
      .references(() => components.id, { onDelete: "cascade" }),
    relationType: varchar({ length: 255 }).$type<ComponentRelation>().notNull(),
  },
  (table) => [
    unique("relations_unique").on(
      table.sourceId,
      table.targetId,
      table.relationType,
    ),
  ],
);
