CREATE TABLE "components_types" (
	"component_id" integer NOT NULL,
	"type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "components_types" ADD CONSTRAINT "components_types_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components_types" ADD CONSTRAINT "components_types_type_id_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."types"("id") ON DELETE cascade ON UPDATE no action;