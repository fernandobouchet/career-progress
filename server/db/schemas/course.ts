import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  unique,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { coursesStatusEnum } from "./enums";
import { users } from "./user";
import {
  careers,
  careersCourses,
  correlatives,
  equivalents,
  optatives,
} from "./career";
import { activities } from "./activity";
import { courseReviews } from "./review";

export const courses = pgTable("course", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  info: text("info"),
  infoUrl: text("info_url"),
  area: text("area"),
  hsWeekly: integer("hs_weekly"),
  hsTotal: integer("hs_total"),
  code: text("code"),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  parentOptionId: integer("parent_option_id").references(
    (): AnyPgColumn => courses.id
  ),
});

export const usersCourses = pgTable(
  "user_course",
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
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    qualification: integer("qualification"),
    status: coursesStatusEnum("status").default("PENDIENTE").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.courseId, table.userId, table.careerId)]
);
export const coursesRelations = relations(courses, ({ many, one }) => ({
  careers: many(careersCourses),
  correlatives: many(correlatives, { relationName: "courseCorrelatives" }),
  requiredBy: many(correlatives, { relationName: "requiredCourses" }),
  optatives: many(optatives, { relationName: "optativeCourses" }),
  optativeOptions: many(optatives, { relationName: "optionCourses" }),
  progress: many(usersCourses),
  baseEquivs: many(equivalents, { relationName: "baseCourses" }),
  targetEquivs: many(equivalents, { relationName: "targetCourses" }),
  parentOption: one(courses, {
    fields: [courses.parentOptionId],
    references: [courses.id],
  }),
  options: many(courses),
  activities: many(activities),
  reviews: many(courseReviews),
}));

export const usersCoursesRelations = relations(usersCourses, ({ one }) => ({
  course: one(courses, {
    fields: [usersCourses.courseId],
    references: [courses.id],
  }),
  user: one(users, { fields: [usersCourses.userId], references: [users.id] }),
  career: one(careers, {
    fields: [usersCourses.careerId],
    references: [careers.id],
  }),
}));
