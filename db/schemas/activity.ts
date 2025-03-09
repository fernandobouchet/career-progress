import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./course";
import { users } from "./user";
import { careers } from "./career";

export const activities = pgTable("activity", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  careerId: integer("career_id")
    .notNull()
    .references(() => careers.id, { onDelete: "cascade" }),
  isCourse: boolean("is_course").default(false).notNull(),
  courseId: integer("course_id").references(() => courses.id),
});

export const usersActivities = pgTable(
  "user_activity",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    careerId: integer("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.activityId, table.careerId)]
);

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  career: one(careers, {
    fields: [activities.careerId],
    references: [careers.id],
  }),
  course: one(courses, {
    fields: [activities.courseId],
    references: [courses.id],
  }),
  usersActivities: many(usersActivities),
}));

export const usersActivitiesRelations = relations(
  usersActivities,
  ({ one }) => ({
    user: one(users, {
      fields: [usersActivities.userId],
      references: [users.id],
    }),
    activity: one(activities, {
      fields: [usersActivities.activityId],
      references: [activities.id],
    }),
    career: one(careers, {
      fields: [usersActivities.careerId],
      references: [careers.id],
    }),
  })
);
