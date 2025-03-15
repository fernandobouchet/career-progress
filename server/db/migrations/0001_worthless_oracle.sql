ALTER TABLE "career" RENAME COLUMN "is_intermediate" TO "is_degree";--> statement-breakpoint
ALTER TABLE "career" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "career" ADD CONSTRAINT "career_slug_unique" UNIQUE("slug");