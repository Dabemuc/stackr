ALTER TABLE "components" ADD COLUMN "article" text;--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "components_tags" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "components_types" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "relations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "types" ADD COLUMN "updated_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE "components" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "types" ADD CONSTRAINT "types_name_unique" UNIQUE("name");
