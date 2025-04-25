import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersCourses } from "./user";
import { careers, careersCourses } from "./career";
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
});

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
    optionCourseId: integer("option_course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.careerId, table.courseId, table.optionCourseId)]
);

export const courseEquivalenceGroups = pgTable("course_equivalence_group", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  careerId: integer("career_id")
    .notNull()
    .references(() => careers.id, { onDelete: "cascade" }),
});

export const equivalents = pgTable("equivalent", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("group_id")
    .notNull()
    .references(() => courseEquivalenceGroups.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["base", "target"] }).notNull(),
});

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
}));

export const courseEquivalenceGroupsRelations = relations(
  courseEquivalenceGroups,
  ({ one, many }) => ({
    career: one(careers, {
      fields: [courseEquivalenceGroups.careerId],
      references: [careers.id],
    }),
    equivalents: many(equivalents),
  })
);

export const equivalentsRelations = relations(equivalents, ({ one }) => ({
  group: one(courseEquivalenceGroups, {
    fields: [equivalents.groupId],
    references: [courseEquivalenceGroups.id],
  }),
  course: one(courses, {
    fields: [equivalents.courseId],
    references: [courses.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  careers: many(careersCourses),
  correlatives: many(correlatives, { relationName: "courseCorrelatives" }),
  optatives: many(optatives, { relationName: "optativeCourses" }),
  equivalents: many(equivalents),
  progress: many(usersCourses),
  activities: many(activities),
  reviews: many(courseReviews),
}));
