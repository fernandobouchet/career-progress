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
import { courses, usersCourses } from "./course";
import { users } from "./user";
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

export const optatives = pgTable(
  "optative",
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
    optionCourseId: integer("option_course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.careerId, table.courseId, table.optionCourseId)]
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

export const careerCourseDependencies = pgTable("career_course_dependency", {
  id: serial("id").primaryKey(),
  careerCourseId: integer("career_course_id")
    .notNull()
    .references(() => careersCourses.id),
  prerequisiteCareerCourseId: integer("prerequisite_career_course_id")
    .notNull()
    .references(() => careersCourses.id),
});

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

export const optativesRelations = relations(optatives, ({ one }) => ({
  career: one(careers, {
    fields: [optatives.careerId],
    references: [careers.id],
  }),
  course: one(courses, {
    fields: [optatives.courseId],
    references: [courses.id],
    relationName: "optativeCourses",
  }),
  optionCourse: one(courses, {
    fields: [optatives.optionCourseId],
    references: [courses.id],
    relationName: "optionCourses",
  }),
  period: one(periods, {
    fields: [optatives.periodId],
    references: [periods.id],
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
