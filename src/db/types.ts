// --- source of truth ---
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
export type ComponentStatus = (typeof componentStatuses)[number];
export type ComponentRelation = (typeof relationTypes)[number];
