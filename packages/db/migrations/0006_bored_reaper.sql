CREATE TYPE "public"."simulation_mode" AS ENUM('custom', 'quick', 'adaptive', 'final_review');--> statement-breakpoint
CREATE TYPE "public"."simulation_status" AS ENUM('in_progress', 'submitted', 'expired');--> statement-breakpoint
CREATE TABLE "simulation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mode" "simulation_mode" NOT NULL,
	"status" "simulation_status" DEFAULT 'in_progress' NOT NULL,
	"question_ids" jsonb NOT NULL,
	"question_versions" jsonb NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"elapsed_seconds" integer DEFAULT 0 NOT NULL,
	"duration_minutes" integer NOT NULL,
	"result" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "simulation_runs" ADD CONSTRAINT "simulation_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "simulation_runs_user_status_idx" ON "simulation_runs" USING btree ("user_id","status");