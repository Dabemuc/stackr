import { PgTransaction } from "drizzle-orm/pg-core";
import { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import { ExtractTablesWithRelations } from "drizzle-orm";

export type Tx = PgTransaction<
  NeonQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;
