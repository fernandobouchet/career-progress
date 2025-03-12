CREATE TYPE "public"."course_status" AS ENUM('CURSANDO', 'PENDIENTE', 'REGULARIZADA', 'APROBADA');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MOD', 'USER');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"info_url" text,
	"area" text,
	"hs_weekly" integer,
	"hs_total" integer,
	"is_placeholder" boolean DEFAULT false NOT NULL,
	"parent_option_id" integer,
	CONSTRAINT "course_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_course" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"career_id" integer NOT NULL,
	"qualification" integer,
	"status" "course_status" DEFAULT 'PENDIENTE' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_course_course_id_user_id_career_id_unique" UNIQUE("course_id","user_id","career_id")
);
--> statement-breakpoint
CREATE TABLE "career" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_intermediate" boolean DEFAULT false NOT NULL,
	"parent_career_id" integer,
	"required_extra_credits" integer,
	CONSTRAINT "career_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "career_course" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"is_obligatory" boolean DEFAULT true NOT NULL,
	"period_id" integer,
	CONSTRAINT "career_course_career_id_course_id_unique" UNIQUE("career_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "correlative" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"required_course_id" integer NOT NULL,
	CONSTRAINT "correlative_career_id_course_id_required_course_id_unique" UNIQUE("career_id","course_id","required_course_id")
);
--> statement-breakpoint
CREATE TABLE "equivalent" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"base_course_id" integer NOT NULL,
	"target_course_id" integer NOT NULL,
	CONSTRAINT "equivalent_career_id_base_course_id_target_course_id_unique" UNIQUE("career_id","base_course_id","target_course_id")
);
--> statement-breakpoint
CREATE TABLE "period" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"career_id" integer NOT NULL,
	CONSTRAINT "period_order_career_id_unique" UNIQUE("order","career_id")
);
--> statement-breakpoint
CREATE TABLE "user_career" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "user_career_career_id_user_id_unique" UNIQUE("career_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "course_review" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"comment" text NOT NULL,
	"difficulty" integer NOT NULL,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"status" "review_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_review_course_id_user_id_unique" UNIQUE("course_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "review_report" (
	"id" text PRIMARY KEY NOT NULL,
	"review_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_report_review_id_user_id_unique" UNIQUE("review_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"credits" integer NOT NULL,
	"career_id" integer NOT NULL,
	"is_course" boolean DEFAULT false NOT NULL,
	"course_id" integer
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"activity_id" integer NOT NULL,
	"career_id" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_activity_user_id_activity_id_career_id_unique" UNIQUE("user_id","activity_id","career_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_parent_option_id_course_id_fk" FOREIGN KEY ("parent_option_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career" ADD CONSTRAINT "career_parent_career_id_career_id_fk" FOREIGN KEY ("parent_career_id") REFERENCES "public"."career"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_course" ADD CONSTRAINT "career_course_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_course" ADD CONSTRAINT "career_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_course" ADD CONSTRAINT "career_course_period_id_period_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."period"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correlative" ADD CONSTRAINT "correlative_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correlative" ADD CONSTRAINT "correlative_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correlative" ADD CONSTRAINT "correlative_required_course_id_course_id_fk" FOREIGN KEY ("required_course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equivalent" ADD CONSTRAINT "equivalent_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equivalent" ADD CONSTRAINT "equivalent_base_course_id_course_id_fk" FOREIGN KEY ("base_course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equivalent" ADD CONSTRAINT "equivalent_target_course_id_course_id_fk" FOREIGN KEY ("target_course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "period" ADD CONSTRAINT "period_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career" ADD CONSTRAINT "user_career_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career" ADD CONSTRAINT "user_career_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_report" ADD CONSTRAINT "review_report_review_id_course_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."course_review"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_report" ADD CONSTRAINT "review_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_activity_id_activity_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;