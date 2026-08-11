CREATE TYPE "public"."essay_submission_status" AS ENUM('draft', 'submitted', 'in_review', 'reviewed');--> statement-breakpoint
CREATE TABLE "essay_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"rubric" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"general_comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essay_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"theme_id" uuid NOT NULL,
	"theme_version" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"text" text NOT NULL,
	"word_count" integer NOT NULL,
	"status" "essay_submission_status" DEFAULT 'draft' NOT NULL,
	"ai_assistance_used" boolean DEFAULT false NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"submitted_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essay_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(140) NOT NULL,
	"title" varchar(200) NOT NULL,
	"prompt" text NOT NULL,
	"supporting_texts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exam_label" varchar(80) NOT NULL,
	"source_url" text NOT NULL,
	"rights_status" "rights_status" NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "essay_themes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"rollout_percent" integer DEFAULT 0 NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "essay_corrections" ADD CONSTRAINT "essay_corrections_submission_id_essay_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."essay_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_corrections" ADD CONSTRAINT "essay_corrections_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_submissions" ADD CONSTRAINT "essay_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_submissions" ADD CONSTRAINT "essay_submissions_theme_id_essay_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."essay_themes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_themes" ADD CONSTRAINT "essay_themes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_themes" ADD CONSTRAINT "essay_themes_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "essay_corrections_submission_idx" ON "essay_corrections" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "essay_submissions_user_status_idx" ON "essay_submissions" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "essay_themes_status_idx" ON "essay_themes" USING btree ("status","published_at");