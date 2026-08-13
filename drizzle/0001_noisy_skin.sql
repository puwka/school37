CREATE TYPE "public"."application_status" AS ENUM('new', 'in_review', 'processed', 'rejected');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_name" varchar(255) NOT NULL,
	"class_grade" integer NOT NULL,
	"class_letter" varchar(8) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"child_name" varchar(255) NOT NULL,
	"status" "application_status" DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"processed_by_id" uuid,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_processed_by_id_users_id_fk" FOREIGN KEY ("processed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applications_created_idx" ON "applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "applications_phone_idx" ON "applications" USING btree ("phone");--> statement-breakpoint
INSERT INTO "menu_items" ("location", "label", "href", "sort_order", "is_external", "is_visible", "open_in_new_tab")
SELECT 'roditelyam', 'Заявка в школу', '/roditelyam/zayavka/', 2, false, true, false
WHERE NOT EXISTS (
  SELECT 1 FROM "menu_items"
  WHERE "location" = 'roditelyam' AND "href" = '/roditelyam/zayavka/'
);