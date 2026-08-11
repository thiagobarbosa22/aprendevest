CREATE TYPE "public"."attempt_context" AS ENUM('practice', 'exam', 'simulation', 'review');--> statement-breakpoint
CREATE TYPE "public"."error_classification" AS ENUM('content', 'interpretation', 'calculation', 'distraction', 'time');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'free_response');--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"answer" text NOT NULL,
	"correct" boolean NOT NULL,
	"duration_seconds" integer NOT NULL,
	"context" "attempt_context" NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"question_version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "error_notebook" (
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"last_attempt_id" uuid NOT NULL,
	"classification" "error_classification",
	"resolved_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "error_notebook_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid,
	"topic_id" uuid NOT NULL,
	"year" integer,
	"number" integer,
	"type" "question_type" DEFAULT 'multiple_choice' NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"resolution" text NOT NULL,
	"common_error" text,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"source_url" text NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"accessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rights_status" "rights_status" NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_notebook" ADD CONSTRAINT "error_notebook_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_notebook" ADD CONSTRAINT "error_notebook_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_notebook" ADD CONSTRAINT "error_notebook_last_attempt_id_attempts_id_fk" FOREIGN KEY ("last_attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attempts_user_idempotency_unique" ON "attempts" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "attempts_user_question_idx" ON "attempts" USING btree ("user_id","question_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_checksum_unique" ON "questions" USING btree ("checksum");--> statement-breakpoint
CREATE INDEX "questions_topic_status_idx" ON "questions" USING btree ("topic_id","status");--> statement-breakpoint
CREATE INDEX "questions_exam_year_idx" ON "questions" USING btree ("exam_id","year");