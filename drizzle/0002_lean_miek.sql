ALTER TABLE "tags" DROP CONSTRAINT "tags_name_unique";--> statement-breakpoint
ALTER TABLE "components" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "components" ALTER COLUMN "status" SET NOT NULL;