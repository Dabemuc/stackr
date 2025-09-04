import { ComponentRelation, ComponentStatus } from "@/db/types";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  unique,
  integer,
  varchar,
  text,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

// ------------------ Components ------------------
export const components = pgTable(
  "components",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    article: text(),
    links: text().array(),
    status: varchar({ length: 255 }).$type<ComponentStatus>().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [unique("components_name_unique").on(table.name)],
);

export type Component = InferSelectModel<typeof components>;
export type NewComponent = Omit<
  InferInsertModel<typeof components>,
  "updated_at"
>;

// ------------------ Tags ------------------
export const tags = pgTable(
  "tags",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    parentTagId: integer("parent_tag_id").references((): any => tags.id, {
      onDelete: "set null",
    }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    unique("tags_name_parent_unique").on(table.name, table.parentTagId),
  ],
);

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = Omit<InferInsertModel<typeof tags>, "updated_at">;

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
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [primaryKey({ columns: [table.componentId, table.tagId] })],
);

// ------------------ Types ------------------
export const types = pgTable(
  "types",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },

  (table) => [unique("types_name_unique").on(table.name)],
);

export type Type = InferSelectModel<typeof types>;
export type NewType = Omit<InferInsertModel<typeof types>, "updated_at">;

// ------------------ Components ↔ Types (many-to-many) ------------------
export const componentsTypes = pgTable("components_types", {
  componentId: integer("component_id")
    .notNull()
    .references(() => components.id, { onDelete: "cascade" }),
  typeId: integer("type_id")
    .notNull()
    .references(() => types.id, { onDelete: "cascade" }),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

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
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    unique("relations_unique").on(
      table.sourceId,
      table.targetId,
      table.relationType,
    ),
  ],
);
