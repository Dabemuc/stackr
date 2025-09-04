import { ComponentUpdateType } from "@/db/validators/zodSchemas";
import fetchComponentFull from "./fetchComponentFull";

type DiffAction = "Create" | "Delete" | "Update";

// Generic diff
type Diff<T> = {
  action: DiffAction;
  before?: T;
  after?: T;
};

// For component diffs, include the field name
type ComponentDiff<T> = Diff<T> & {
  field: string;
};

export type DiffResult = {
  component: ComponentDiff<any>[];
  tags: Diff<any>[];
  types: Diff<any>[];
  relations: Diff<any>[];
};

export default function buildUpdateStoredDiff(
  update: ComponentUpdateType,
  stored: Exclude<Awaited<ReturnType<typeof fetchComponentFull>>, null>,
): DiffResult {
  const diffs: DiffResult = {
    component: [],
    tags: [],
    types: [],
    relations: [],
  };

  // === Component diff ===
  const componentFields: (keyof typeof update)[] = [
    "name",
    "description",
    "article",
    "links",
    "status",
  ];

  for (const field of componentFields) {
    const before = (stored.component as any)[field] ?? null;
    const after = (update as any)[field] ?? null;

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      diffs.component.push({
        field,
        action: "Update",
        before,
        after,
      });
    }
  }

  // === Tags diff ===
  const storedTags = new Map(stored.tagRows.map((t) => [t.name, t]));
  const updateTags = new Set(update.tags);

  for (const tag of stored.tagRows) {
    if (!updateTags.has(tag.name)) {
      diffs.tags.push({ action: "Delete", before: tag });
    }
  }

  for (const tag of update.tags) {
    if (!storedTags.has(tag)) {
      diffs.tags.push({ action: "Create", after: { name: tag } });
    }
  }

  // === Types diff ===
  const storedTypes = new Map(stored.typeRows.map((t) => [t.name, t]));
  const updateTypes = new Map(update.type.map((t) => [t.name, t]));

  for (const t of stored.typeRows) {
    if (!updateTypes.has(t.name)) {
      diffs.types.push({ action: "Delete", before: t });
    }
  }

  for (const t of update.type) {
    if (!storedTypes.has(t.name)) {
      diffs.types.push({ action: "Create", after: t });
    }
  }

  // === Relations diff ===
  const storedRels = new Map(
    stored.relationRowsRaw.map((r) => [r.target.id + ":" + r.relationType, r]),
  );
  const updateRels = new Map(
    update.relations.map((r) => [r.targetId + ":" + r.relationType, r]),
  );

  for (const r of stored.relationRowsRaw) {
    const key = r.target.id + ":" + r.relationType;
    if (!updateRels.has(key)) {
      diffs.relations.push({ action: "Delete", before: r });
    }
  }

  for (const r of update.relations) {
    const key = r.targetId + ":" + r.relationType;
    if (!storedRels.has(key)) {
      diffs.relations.push({ action: "Create", after: r });
    }
  }

  return diffs;
}
