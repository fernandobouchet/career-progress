CREATE TABLE "course_equivalence_group" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equivalent" DROP CONSTRAINT "equivalent_career_id_base_course_id_target_course_id_unique";--> statement-breakpoint
ALTER TABLE "course" DROP CONSTRAINT "course_parent_option_id_course_id_fk";
--> statement-breakpoint
ALTER TABLE "equivalent" DROP CONSTRAINT "equivalent_career_id_career_id_fk";
--> statement-breakpoint
ALTER TABLE "equivalent" DROP CONSTRAINT "equivalent_base_course_id_course_id_fk";
--> statement-breakpoint
ALTER TABLE "equivalent" DROP CONSTRAINT "equivalent_target_course_id_course_id_fk";
--> statement-breakpoint
ALTER TABLE "user_course" ADD COLUMN "approved_date" timestamp;--> statement-breakpoint
ALTER TABLE "equivalent" ADD COLUMN "group_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "equivalent" ADD COLUMN "course_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "equivalent" ADD COLUMN "role" text NOT NULL;--> statement-breakpoint
ALTER TABLE "course_equivalence_group" ADD CONSTRAINT "course_equivalence_group_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equivalent" ADD CONSTRAINT "equivalent_group_id_course_equivalence_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."course_equivalence_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equivalent" ADD CONSTRAINT "equivalent_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" DROP COLUMN "parent_option_id";--> statement-breakpoint
ALTER TABLE "equivalent" DROP COLUMN "career_id";--> statement-breakpoint
ALTER TABLE "equivalent" DROP COLUMN "base_course_id";--> statement-breakpoint
ALTER TABLE "equivalent" DROP COLUMN "target_course_id";