CREATE TYPE "public"."study_plan_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."study_task_kind" AS ENUM('theory', 'practice', 'review', 'simulation');--> statement-breakpoint
CREATE TYPE "public"."study_task_status" AS ENUM('pending', 'completed', 'skipped');--> statement-breakpoint
CREATE TABLE "diagnostics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mastery" (
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"estimate_percent" integer NOT NULL,
	"evidence_count" integer DEFAULT 0 NOT NULL,
	"evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" uuid,
	"source_type" varchar(40) NOT NULL,
	"source_id" uuid NOT NULL,
	"interval_days" integer DEFAULT 1 NOT NULL,
	"next_review_at" timestamp with time zone NOT NULL,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "study_plan_status" DEFAULT 'active' NOT NULL,
	"weekly_minutes" integer NOT NULL,
	"explanation" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"topic_id" uuid,
	"content_id" uuid,
	"title" varchar(180) NOT NULL,
	"kind" "study_task_kind" NOT NULL,
	"status" "study_task_status" DEFAULT 'pending' NOT NULL,
	"minutes" integer NOT NULL,
	"reason" text NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery" ADD CONSTRAINT "mastery_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery" ADD CONSTRAINT "mastery_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_tasks" ADD CONSTRAINT "study_tasks_plan_id_study_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."study_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_tasks" ADD CONSTRAINT "study_tasks_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_tasks" ADD CONSTRAINT "study_tasks_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diagnostics_user_date_idx" ON "diagnostics" USING btree ("user_id","completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "mastery_user_topic_unique" ON "mastery" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_items_user_source_unique" ON "review_items" USING btree ("user_id","source_type","source_id","topic_id");--> statement-breakpoint
CREATE INDEX "review_items_due_idx" ON "review_items" USING btree ("user_id","next_review_at");--> statement-breakpoint
CREATE INDEX "study_plans_user_status_idx" ON "study_plans" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "study_tasks_plan_date_idx" ON "study_tasks" USING btree ("plan_id","scheduled_for");