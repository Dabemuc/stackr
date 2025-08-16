export type ComponentType =
  | "Framework"
  | "Database"
  | "Package"
  | "Tool"
  | "Service"
  | "Platform";

export type ComponentStatus =
  | "Experimental"
  | "Production-ready"
  | "Deprecated";

export type ComponentRelation = "Depends on" | "Alternative to" | "Complements";
