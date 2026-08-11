CREATE TYPE "public"."content_level" AS ENUM('basico', 'intermediario', 'avancado');--> statement-breakpoint
CREATE TYPE "public"."pedagogical_type" AS ENUM('teoria', 'exercicios', 'revisao');--> statement-breakpoint
CREATE TABLE "literary_works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"edition_year" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"author" varchar(160) NOT NULL,
	"genre" varchar(80),
	"source_url" text NOT NULL,
	"notes" text,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_items" ADD COLUMN "level" "content_level" DEFAULT 'basico' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_items" ADD COLUMN "pedagogical_type" "pedagogical_type" DEFAULT 'teoria' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_items" ADD COLUMN "exam_tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "content_items" ADD COLUMN "prerequisite_summary" text;--> statement-breakpoint
ALTER TABLE "literary_works" ADD CONSTRAINT "literary_works_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "literary_works_exam_edition_idx" ON "literary_works" USING btree ("exam_id","edition_year");--> statement-breakpoint
CREATE UNIQUE INDEX "literary_works_exam_edition_title_unique" ON "literary_works" USING btree ("exam_id","edition_year","title");