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
import { courses } from "./course";
import { users } from "./user";
import { activities, usersActivities } from "./activity";

export const careers = pgTable("career", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  isIntermediate: boolean("is_intermediate").default(false).notNull(),
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
    isObligatory: boolean("is_obligatory").default(true).notNull(),
    periodId: integer("period_id").references(() => periods.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [unique().on(table.careerId, table.courseId)]
);

export const correlatives = pgTable(
  "correlative",
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
    requiredCourseId: integer("required_course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique().on(table.careerId, table.courseId, table.requiredCourseId),
  ]
);

export const equivalents = pgTable(
  "equivalent",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    baseCourseId: integer("base_course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    targetCourseId: integer("target_course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique().on(table.careerId, table.baseCourseId, table.targetCourseId),
  ]
);

export const usersCareers = pgTable(
  "user_career",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.careerId, table.userId)]
);

export const careersRelations = relations(careers, ({ many, one }) => ({
  periods: many(periods),
  courses: many(careersCourses),
  correlatives: many(correlatives),
  equivalents: many(equivalents),
  users: many(usersCareers),
  activities: many(activities),
  userActivities: many(usersActivities),
  parentCareer: one(careers, {
    fields: [careers.parentCareerId],
    references: [careers.id],
  }),
  childCareers: many(careers),
}));

export const periodsRelations = relations(periods, ({ one, many }) => ({
  career: one(careers, {
    fields: [periods.careerId],
    references: [careers.id],
  }),
  courses: many(careersCourses),
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

export const correlativesRelations = relations(correlatives, ({ one }) => ({
  career: one(careers, {
    fields: [correlatives.careerId],
    references: [careers.id],
  }),
  course: one(courses, {
    fields: [correlatives.courseId],
    references: [courses.id],
    relationName: "courseCorrelatives",
  }),
  requiredCourse: one(courses, {
    fields: [correlatives.requiredCourseId],
    references: [courses.id],
    relationName: "requiredCourses",
  }),
}));

export const equivalentsRelations = relations(equivalents, ({ one }) => ({
  career: one(careers, {
    fields: [equivalents.careerId],
    references: [careers.id],
  }),
  baseCourse: one(courses, {
    fields: [equivalents.baseCourseId],
    references: [courses.id],
    relationName: "baseCourses",
  }),
  targetCourse: one(courses, {
    fields: [equivalents.targetCourseId],
    references: [courses.id],
    relationName: "targetCourses",
  }),
}));

export const usersCareersRelations = relations(usersCareers, ({ one }) => ({
  career: one(careers, {
    fields: [usersCareers.careerId],
    references: [careers.id],
  }),
  user: one(users, { fields: [usersCareers.userId], references: [users.id] }),
}));
