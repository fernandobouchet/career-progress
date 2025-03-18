CREATE TABLE "optative" (
	"id" text PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"period_id" integer,
	"option_course_id" integer NOT NULL,
	CONSTRAINT "optative_career_id_course_id_option_course_id_unique" UNIQUE("career_id","course_id","option_course_id")
);
--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "info" text;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "optative" ADD CONSTRAINT "optative_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optative" ADD CONSTRAINT "optative_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optative" ADD CONSTRAINT "optative_period_id_period_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."period"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "optative" ADD CONSTRAINT "optative_option_course_id_course_id_fk" FOREIGN KEY ("option_course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_course" DROP COLUMN "is_obligatory";