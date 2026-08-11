CREATE TYPE "public"."exam_run_status" AS ENUM('in_progress', 'submitted', 'expired');--> statement-breakpoint
CREATE TABLE "exam_paper_questions" (
	"paper_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "exam_paper_questions_paper_id_question_id_pk" PRIMARY KEY("paper_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "exam_papers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"edition_id" uuid NOT NULL,
	"slug" varchar(140) NOT NULL,
	"title" varchar(200) NOT NULL,
	"phase" varchar(80),
	"day" integer,
	"duration_minutes" integer NOT NULL,
	"official_url" text NOT NULL,
	"answer_key_url" text,
	"checksum" varchar(64) NOT NULL,
	"rights_status" "rights_status" NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"paper_id" uuid NOT NULL,
	"paper_version" integer NOT NULL,
	"status" "exam_run_status" DEFAULT 'in_progress' NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"elapsed_seconds" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "exam_paper_questions" ADD CONSTRAINT "exam_paper_questions_paper_id_exam_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."exam_papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_paper_questions" ADD CONSTRAINT "exam_paper_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_edition_id_exam_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."exam_editions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_runs" ADD CONSTRAINT "exam_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_runs" ADD CONSTRAINT "exam_runs_paper_id_exam_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."exam_papers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "paper_question_position_unique" ON "exam_paper_questions" USING btree ("paper_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_papers_slug_unique" ON "exam_papers" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_papers_checksum_unique" ON "exam_papers" USING btree ("checksum");--> statement-breakpoint
CREATE INDEX "exam_runs_user_status_idx" ON "exam_runs" USING btree ("user_id","status");