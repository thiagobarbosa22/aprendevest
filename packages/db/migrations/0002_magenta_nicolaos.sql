CREATE TYPE "public"."content_type" AS ENUM('lesson', 'video', 'summary', 'mind_map', 'flashcards', 'audio', 'formula_sheet');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "content_bookmarks" (
	"user_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_bookmarks_user_id_content_id_pk" PRIMARY KEY("user_id","content_id")
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"type" "content_type" DEFAULT 'lesson' NOT NULL,
	"title" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"body" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"media_url" text,
	"transcript" text,
	"chapters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accessible_text" text NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"source_url" text NOT NULL,
	"rights_status" "rights_status" DEFAULT 'under_review' NOT NULL,
	"checksum" varchar(64),
	"verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"body" text NOT NULL,
	"timestamp_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_progress" (
	"user_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"percent" integer DEFAULT 0 NOT NULL,
	"position_seconds" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_progress_user_id_content_id_pk" PRIMARY KEY("user_id","content_id")
);
--> statement-breakpoint
CREATE TABLE "curriculum_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_bookmarks" ADD CONSTRAINT "content_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_bookmarks" ADD CONSTRAINT "content_bookmarks_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_module_id_curriculum_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."curriculum_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_notes" ADD CONSTRAINT "content_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_notes" ADD CONSTRAINT "content_notes_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_progress" ADD CONSTRAINT "content_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_progress" ADD CONSTRAINT "content_progress_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_items_slug_unique" ON "content_items" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_items_topic_status_idx" ON "content_items" USING btree ("topic_id","status");--> statement-breakpoint
CREATE INDEX "content_items_module_position_idx" ON "content_items" USING btree ("module_id","created_at");--> statement-breakpoint
CREATE INDEX "content_notes_user_content_idx" ON "content_notes" USING btree ("user_id","content_id");--> statement-breakpoint
CREATE INDEX "content_progress_user_status_idx" ON "content_progress" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "curriculum_modules_subject_slug_unique" ON "curriculum_modules" USING btree ("subject_id","slug");