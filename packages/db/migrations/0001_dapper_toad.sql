CREATE TYPE "public"."editorial_status" AS ENUM('draft', 'in_review', 'approved', 'published', 'archived', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."rights_status" AS ENUM('official_link', 'authorized', 'platform_authored', 'under_review', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."subject_area" AS ENUM('languages', 'mathematics', 'natural_sciences', 'human_sciences', 'interdisciplinary');--> statement-breakpoint
CREATE TABLE "editorial_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(80) NOT NULL,
	"entity_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"status" "editorial_status" NOT NULL,
	"snapshot" jsonb NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"decision_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"edition_label" varchar(80),
	"format" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"calendar" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rules_source_url" text NOT NULL,
	"verified_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(160) NOT NULL,
	"acronym" varchar(24) NOT NULL,
	"institution" varchar(160) NOT NULL,
	"board" varchar(120) NOT NULL,
	"region" varchar(80) NOT NULL,
	"official_url" text NOT NULL,
	"summary" text NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"source_url" text,
	"rights_status" "rights_status" DEFAULT 'under_review' NOT NULL,
	"verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"name" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"area" "subject_area" NOT NULL,
	"summary" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"source_url" text,
	"rights_status" "rights_status" DEFAULT 'under_review' NOT NULL,
	"verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_prerequisites" (
	"topic_id" uuid NOT NULL,
	"prerequisite_topic_id" uuid NOT NULL,
	CONSTRAINT "topic_prerequisites_topic_id_prerequisite_topic_id_pk" PRIMARY KEY("topic_id","prerequisite_topic_id")
);
--> statement-breakpoint
CREATE TABLE "topic_skills" (
	"topic_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	CONSTRAINT "topic_skills_topic_id_skill_id_pk" PRIMARY KEY("topic_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"parent_id" uuid,
	"slug" varchar(120) NOT NULL,
	"name" varchar(140) NOT NULL,
	"summary" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"estimated_minutes" integer DEFAULT 30 NOT NULL,
	"status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "editorial_revisions" ADD CONSTRAINT "editorial_revisions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editorial_revisions" ADD CONSTRAINT "editorial_revisions_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_editions" ADD CONSTRAINT "exam_editions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_prerequisites" ADD CONSTRAINT "topic_prerequisites_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_prerequisites" ADD CONSTRAINT "topic_prerequisites_prerequisite_topic_id_topics_id_fk" FOREIGN KEY ("prerequisite_topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_skills" ADD CONSTRAINT "topic_skills_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_skills" ADD CONSTRAINT "topic_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_parent_id_topics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "editorial_revision_entity_idx" ON "editorial_revisions" USING btree ("entity_type","entity_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_editions_exam_year_unique" ON "exam_editions" USING btree ("exam_id","year");--> statement-breakpoint
CREATE UNIQUE INDEX "exams_slug_unique" ON "exams" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "exams_status_idx" ON "exams" USING btree ("status");--> statement-breakpoint
CREATE INDEX "exams_institution_idx" ON "exams" USING btree ("institution");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_code_unique" ON "skills" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_slug_unique" ON "subjects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "subjects_area_status_idx" ON "subjects" USING btree ("area","status");--> statement-breakpoint
CREATE UNIQUE INDEX "topics_subject_slug_unique" ON "topics" USING btree ("subject_id","slug");--> statement-breakpoint
CREATE INDEX "topics_parent_idx" ON "topics" USING btree ("parent_id");