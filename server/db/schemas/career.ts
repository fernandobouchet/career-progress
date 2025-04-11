import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  unique,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { correlatives, courses, equivalents, optatives } from "./course";
import { usersCareers, usersCourses } from "./user";
import { activities, usersActivities } from "./activity";

export const careers = pgTable("career", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  isDegree: boolean("is_degree").default(true).notNull(),
  parentCareerId: integer("parent_career_id").references(
    (): AnyPgColumn => careers.id
  ),
  requiredExtraCredits: integer("required_extra_credits"),
});

export const periods = pgTable(
  "period",
  {
    id: serial("id").primaryKey(),
    order: integer("order").notNull(),
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.order, table.careerId)]
);

export const careersCourses = pgTable(
  "career_course",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    periodId: integer("period_id").references(() => periods.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [unique().on(table.careerId, table.courseId)]
);

export const periodsRelations = relations(periods, ({ one, many }) => ({
  career: one(careers, {
    fields: [periods.careerId],
    references: [careers.id],
  }),
  courses: many(careersCourses),
  optatives: many(optatives),
}));

export const careersCoursesRelations = relations(careersCourses, ({ one }) => ({
  career: one(careers, {
    fields: [careersCourses.careerId],
    references: [careers.id],
  }),
  course: one(courses, {
    fields: [careersCourses.courseId],
    references: [courses.id],
  }),
  period: one(periods, {
    fields: [careersCourses.periodId],
    references: [periods.id],
  }),
}));

export const careersRelations = relations(careers, ({ many, one }) => ({
  periods: many(periods),
  courses: many(careersCourses),
  correlatives: many(correlatives),
  equivalents: many(equivalents),
  optatives: many(optatives),
  users: many(usersCareers),
  activities: many(activities),
  userActivities: many(usersActivities),
  parentCareer: one(careers, {
    fields: [careers.parentCareerId],
    references: [careers.id],
  }),
  childCareers: many(careers),
  userCourses: many(usersCourses),
}));
