import { pgTable, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { reviewsStatusEnum } from "./enums";
import { courses } from "./course";
import { users } from "./user";

export const courseReviews = pgTable(
  "course_review",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    difficulty: integer("difficulty").notNull().$type<1 | 2 | 3 | 4 | 5>(),
    helpfulCount: integer("helpful_count").default(0).notNull(),
    status: reviewsStatusEnum("status").default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.courseId, table.userId)]
);

export const reviewsReports = pgTable(
  "review_report",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    reviewId: text("review_id")
      .notNull()
      .references(() => courseReviews.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.reviewId, table.userId)]
);

export const courseReviewsRelations = relations(
  courseReviews,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseReviews.courseId],
      references: [courses.id],
    }),
    user: one(users, {
      fields: [courseReviews.userId],
      references: [users.id],
    }),
    reports: many(reviewsReports),
  })
);

export const reviewsReportsRelations = relations(reviewsReports, ({ one }) => ({
  review: one(courseReviews, {
    fields: [reviewsReports.reviewId],
    references: [courseReviews.id],
  }),
  user: one(users, { fields: [reviewsReports.userId], references: [users.id] }),
}));
