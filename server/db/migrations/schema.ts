import { pgTable, foreignKey, unique, serial, text, boolean, integer, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const courseStatus = pgEnum("course_status", ['CURSANDO', 'PENDIENTE', 'REGULARIZADA', 'APROBADA'])
export const reviewStatus = pgEnum("review_status", ['PENDING', 'APPROVED', 'REJECTED'])
export const role = pgEnum("role", ['ADMIN', 'MOD', 'USER'])


export const career = pgTable("career", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	isDegree: boolean("is_degree").default(true).notNull(),
	parentCareerId: integer("parent_career_id"),
	requiredExtraCredits: integer("required_extra_credits"),
	slug: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parentCareerId],
			foreignColumns: [table.id],
			name: "career_parent_career_id_career_id_fk"
		}),
	unique("career_name_unique").on(table.name),
	unique("career_slug_unique").on(table.slug),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	image: text(),
	role: role().default('USER').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const course = pgTable("course", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	infoUrl: text("info_url"),
	area: text(),
	hsWeekly: integer("hs_weekly"),
	hsTotal: integer("hs_total"),
	isPlaceholder: boolean("is_placeholder").default(false).notNull(),
	parentOptionId: integer("parent_option_id"),
}, (table) => [
	foreignKey({
			columns: [table.parentOptionId],
			foreignColumns: [table.id],
			name: "course_parent_option_id_course_id_fk"
		}),
	unique("course_name_unique").on(table.name),
]);

export const userCourse = pgTable("user_course", {
	id: text().primaryKey().notNull(),
	courseId: integer("course_id").notNull(),
	userId: text("user_id").notNull(),
	careerId: integer("career_id").notNull(),
	qualification: integer(),
	status: courseStatus().default('PENDIENTE').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.id],
			name: "user_course_course_id_course_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_course_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "user_course_career_id_career_id_fk"
		}).onDelete("cascade"),
	unique("user_course_course_id_user_id_career_id_unique").on(table.courseId, table.userId, table.careerId),
]);

export const careerCourse = pgTable("career_course", {
	id: text().primaryKey().notNull(),
	careerId: integer("career_id").notNull(),
	courseId: integer("course_id").notNull(),
	isObligatory: boolean("is_obligatory").default(true).notNull(),
	periodId: integer("period_id"),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "career_course_career_id_career_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.id],
			name: "career_course_course_id_course_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.periodId],
			foreignColumns: [period.id],
			name: "career_course_period_id_period_id_fk"
		}).onDelete("cascade"),
	unique("career_course_career_id_course_id_unique").on(table.careerId, table.courseId),
]);

export const period = pgTable("period", {
	id: serial().primaryKey().notNull(),
	order: integer().notNull(),
	careerId: integer("career_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "period_career_id_career_id_fk"
		}).onDelete("cascade"),
	unique("period_order_career_id_unique").on(table.order, table.careerId),
]);

export const correlative = pgTable("correlative", {
	id: text().primaryKey().notNull(),
	careerId: integer("career_id").notNull(),
	courseId: integer("course_id").notNull(),
	requiredCourseId: integer("required_course_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "correlative_career_id_career_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.id],
			name: "correlative_course_id_course_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.requiredCourseId],
			foreignColumns: [course.id],
			name: "correlative_required_course_id_course_id_fk"
		}).onDelete("cascade"),
	unique("correlative_career_id_course_id_required_course_id_unique").on(table.careerId, table.courseId, table.requiredCourseId),
]);

export const equivalent = pgTable("equivalent", {
	id: text().primaryKey().notNull(),
	careerId: integer("career_id").notNull(),
	baseCourseId: integer("base_course_id").notNull(),
	targetCourseId: integer("target_course_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "equivalent_career_id_career_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.baseCourseId],
			foreignColumns: [course.id],
			name: "equivalent_base_course_id_course_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.targetCourseId],
			foreignColumns: [course.id],
			name: "equivalent_target_course_id_course_id_fk"
		}).onDelete("cascade"),
	unique("equivalent_career_id_base_course_id_target_course_id_unique").on(table.careerId, table.baseCourseId, table.targetCourseId),
]);

export const userCareer = pgTable("user_career", {
	id: text().primaryKey().notNull(),
	careerId: integer("career_id").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "user_career_career_id_career_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_career_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("user_career_career_id_user_id_unique").on(table.careerId, table.userId),
]);

export const courseReview = pgTable("course_review", {
	id: text().primaryKey().notNull(),
	courseId: integer("course_id").notNull(),
	userId: text("user_id").notNull(),
	comment: text().notNull(),
	difficulty: integer().notNull(),
	helpfulCount: integer("helpful_count").default(0).notNull(),
	status: reviewStatus().default('PENDING').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.id],
			name: "course_review_course_id_course_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "course_review_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("course_review_course_id_user_id_unique").on(table.courseId, table.userId),
]);

export const reviewReport = pgTable("review_report", {
	id: text().primaryKey().notNull(),
	reviewId: text("review_id").notNull(),
	userId: text("user_id").notNull(),
	reason: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.reviewId],
			foreignColumns: [courseReview.id],
			name: "review_report_review_id_course_review_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "review_report_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("review_report_review_id_user_id_unique").on(table.reviewId, table.userId),
]);

export const activity = pgTable("activity", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	credits: integer().notNull(),
	careerId: integer("career_id").notNull(),
	isCourse: boolean("is_course").default(false).notNull(),
	courseId: integer("course_id"),
}, (table) => [
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "activity_career_id_career_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.id],
			name: "activity_course_id_course_id_fk"
		}),
]);

export const userActivity = pgTable("user_activity", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	activityId: integer("activity_id").notNull(),
	careerId: integer("career_id").notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_activity_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activity.id],
			name: "user_activity_activity_id_activity_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.careerId],
			foreignColumns: [career.id],
			name: "user_activity_career_id_career_id_fk"
		}).onDelete("cascade"),
	unique("user_activity_user_id_activity_id_career_id_unique").on(table.userId, table.activityId, table.careerId),
]);
