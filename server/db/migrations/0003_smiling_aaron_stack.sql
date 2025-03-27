ALTER TABLE "user_course" DROP CONSTRAINT "user_course_course_id_user_id_career_id_unique";--> statement-breakpoint
ALTER TABLE "user_course" DROP CONSTRAINT "user_course_career_id_career_id_fk";
--> statement-breakpoint
ALTER TABLE "user_course" DROP COLUMN "career_id";--> statement-breakpoint
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_user_id_unique" UNIQUE("course_id","user_id");