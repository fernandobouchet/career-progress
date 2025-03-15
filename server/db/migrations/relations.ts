import { relations } from "drizzle-orm/relations";
import { career, user, account, session, course, userCourse, careerCourse, period, correlative, equivalent, userCareer, courseReview, reviewReport, activity, userActivity } from "./schema";

export const careerRelations = relations(career, ({one, many}) => ({
	career: one(career, {
		fields: [career.parentCareerId],
		references: [career.id],
		relationName: "career_parentCareerId_career_id"
	}),
	careers: many(career, {
		relationName: "career_parentCareerId_career_id"
	}),
	userCourses: many(userCourse),
	careerCourses: many(careerCourse),
	periods: many(period),
	correlatives: many(correlative),
	equivalents: many(equivalent),
	userCareers: many(userCareer),
	activities: many(activity),
	userActivities: many(userActivity),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	userCourses: many(userCourse),
	userCareers: many(userCareer),
	courseReviews: many(courseReview),
	reviewReports: many(reviewReport),
	userActivities: many(userActivity),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const courseRelations = relations(course, ({one, many}) => ({
	course: one(course, {
		fields: [course.parentOptionId],
		references: [course.id],
		relationName: "course_parentOptionId_course_id"
	}),
	courses: many(course, {
		relationName: "course_parentOptionId_course_id"
	}),
	userCourses: many(userCourse),
	careerCourses: many(careerCourse),
	correlatives_courseId: many(correlative, {
		relationName: "correlative_courseId_course_id"
	}),
	correlatives_requiredCourseId: many(correlative, {
		relationName: "correlative_requiredCourseId_course_id"
	}),
	equivalents_baseCourseId: many(equivalent, {
		relationName: "equivalent_baseCourseId_course_id"
	}),
	equivalents_targetCourseId: many(equivalent, {
		relationName: "equivalent_targetCourseId_course_id"
	}),
	courseReviews: many(courseReview),
	activities: many(activity),
}));

export const userCourseRelations = relations(userCourse, ({one}) => ({
	course: one(course, {
		fields: [userCourse.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [userCourse.userId],
		references: [user.id]
	}),
	career: one(career, {
		fields: [userCourse.careerId],
		references: [career.id]
	}),
}));

export const careerCourseRelations = relations(careerCourse, ({one}) => ({
	career: one(career, {
		fields: [careerCourse.careerId],
		references: [career.id]
	}),
	course: one(course, {
		fields: [careerCourse.courseId],
		references: [course.id]
	}),
	period: one(period, {
		fields: [careerCourse.periodId],
		references: [period.id]
	}),
}));

export const periodRelations = relations(period, ({one, many}) => ({
	careerCourses: many(careerCourse),
	career: one(career, {
		fields: [period.careerId],
		references: [career.id]
	}),
}));

export const correlativeRelations = relations(correlative, ({one}) => ({
	career: one(career, {
		fields: [correlative.careerId],
		references: [career.id]
	}),
	course_courseId: one(course, {
		fields: [correlative.courseId],
		references: [course.id],
		relationName: "correlative_courseId_course_id"
	}),
	course_requiredCourseId: one(course, {
		fields: [correlative.requiredCourseId],
		references: [course.id],
		relationName: "correlative_requiredCourseId_course_id"
	}),
}));

export const equivalentRelations = relations(equivalent, ({one}) => ({
	career: one(career, {
		fields: [equivalent.careerId],
		references: [career.id]
	}),
	course_baseCourseId: one(course, {
		fields: [equivalent.baseCourseId],
		references: [course.id],
		relationName: "equivalent_baseCourseId_course_id"
	}),
	course_targetCourseId: one(course, {
		fields: [equivalent.targetCourseId],
		references: [course.id],
		relationName: "equivalent_targetCourseId_course_id"
	}),
}));

export const userCareerRelations = relations(userCareer, ({one}) => ({
	career: one(career, {
		fields: [userCareer.careerId],
		references: [career.id]
	}),
	user: one(user, {
		fields: [userCareer.userId],
		references: [user.id]
	}),
}));

export const courseReviewRelations = relations(courseReview, ({one, many}) => ({
	course: one(course, {
		fields: [courseReview.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [courseReview.userId],
		references: [user.id]
	}),
	reviewReports: many(reviewReport),
}));

export const reviewReportRelations = relations(reviewReport, ({one}) => ({
	courseReview: one(courseReview, {
		fields: [reviewReport.reviewId],
		references: [courseReview.id]
	}),
	user: one(user, {
		fields: [reviewReport.userId],
		references: [user.id]
	}),
}));

export const activityRelations = relations(activity, ({one, many}) => ({
	career: one(career, {
		fields: [activity.careerId],
		references: [career.id]
	}),
	course: one(course, {
		fields: [activity.courseId],
		references: [course.id]
	}),
	userActivities: many(userActivity),
}));

export const userActivityRelations = relations(userActivity, ({one}) => ({
	user: one(user, {
		fields: [userActivity.userId],
		references: [user.id]
	}),
	activity: one(activity, {
		fields: [userActivity.activityId],
		references: [activity.id]
	}),
	career: one(career, {
		fields: [userActivity.careerId],
		references: [career.id]
	}),
}));