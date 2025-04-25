import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";
import { coursesStatusEnum, rolesEnum } from "./enums";
import { courses } from "./course";
import { careers } from "./career";
import { usersActivities } from "./activity";
import { courseReviews, reviewsReports } from "./review";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  role: rolesEnum("role").default("USER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

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

export const usersCourses = pgTable(
  "user_course",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    placeholderCourseId: integer("placeholder_course_id").references(
      () => courses.id,
      { onDelete: "cascade" }
    ),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    qualification: integer("qualification"),
    status: coursesStatusEnum("status").default("PENDIENTE").notNull(),
    approvedDate: timestamp("approved_date"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.courseId, table.userId)]
);

export const usersCareersRelations = relations(usersCareers, ({ one }) => ({
  career: one(careers, {
    fields: [usersCareers.careerId],
    references: [careers.id],
  }),
  user: one(users, { fields: [usersCareers.userId], references: [users.id] }),
}));

export const usersCoursesRelations = relations(usersCourses, ({ one }) => ({
  course: one(courses, {
    fields: [usersCourses.courseId],
    references: [courses.id],
  }),
  user: one(users, { fields: [usersCourses.userId], references: [users.id] }),
}));

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  courses: many(usersCourses),
  careers: many(usersCareers),
  activities: many(usersActivities),
  reviews: many(courseReviews),
  reports: many(reviewsReports),
}));
