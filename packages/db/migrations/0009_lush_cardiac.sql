CREATE TYPE "public"."enem_simulation_status" AS ENUM('in_progress', 'submitted');--> statement-breakpoint
CREATE TABLE "enem_question_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"questions" jsonb NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enem_simulation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"discipline" varchar(40) NOT NULL,
	"language" varchar(20),
	"questions" jsonb NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"elapsed_seconds" integer DEFAULT 0 NOT NULL,
	"status" "enem_simulation_status" DEFAULT 'in_progress' NOT NULL,
	"result" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "enem_simulation_runs" ADD CONSTRAINT "enem_simulation_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enem_question_cache_year_unique" ON "enem_question_cache" USING btree ("year");--> statement-breakpoint
CREATE INDEX "enem_simulation_runs_user_idx" ON "enem_simulation_runs" USING btree ("user_id","started_at");