import { z } from "zod";
import { componentStatuses, relationTypes } from "../types";

// shared base
export const ComponentBaseSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    article: z.string(),
    links: z
      .array(
        z.object({
          title: z.string(),
          link: z.string(),
        }),
      )
      .default([]),
    status: z.enum(componentStatuses),
    tags: z.array(z.string()).default([]),
    type: z
      .array(
        z.object({
          id: z.number().nullable(),
          name: z.string(),
        }),
      )
      .default([]),
    relations: z
      .array(
        z.object({
          targetId: z.string(),
          relationType: z.enum(relationTypes),
        }),
      )
      .default([]),
  })
  .strip(); // Remove unwanted fields

export const ComponentInsertSchema = ComponentBaseSchema;

export type ComponentInsertType = z.infer<typeof ComponentInsertSchema>;

export const ComponentUpdateSchema = ComponentBaseSchema.extend({
  id: z.number(),
});

export type ComponentUpdateType = z.infer<typeof ComponentUpdateSchema>;
