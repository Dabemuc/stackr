// --- source of truth ---
export const componentTypes = [
  "Framework",
  "Database",
  "Package",
  "Tool",
  "Service",
  "Platform",
] as const;

export const componentStatuses = [
  "Experimental",
  "Production-ready",
  "Deprecated",
] as const;

export const relationTypes = [
  "Depends on",
  "Alternative to",
  "Complements",
] as const;

// --- inferred types ---
export type ComponentType = (typeof componentTypes)[number];
export type ComponentStatus = (typeof componentStatuses)[number];
export type ComponentRelation = (typeof relationTypes)[number];
