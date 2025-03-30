import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { usersCourses } from "@/server/db/schema";
import { statusKeys } from "@/types/constants";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getCourseProgress: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;

    if (!user) return null;

    const userCourses = await ctx.db.query.usersCourses.findMany({
      where: (usersCourses, { eq }) => eq(usersCourses.userId, user.id),
    });
    return userCourses;
  }),
  updateCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        status: z.enum(statusKeys),
        qualification: z.number().min(4).max(10).nullable(),
      })
    )
    .mutation(async ({ input: { courseId, status, qualification }, ctx }) => {
      const user = ctx.session?.user;

      if (!user) return null;

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, courseId),
      });

      if (!course) return null;

      const userCourse = await ctx.db.query.usersCourses.findFirst({
        where: (uc, { and, eq }) =>
          and(eq(uc.userId, user.id), eq(uc.courseId, courseId)),
      });

      if (status === "PENDIENTE") {
        if (userCourse) {
          await ctx.db
            .delete(usersCourses)
            .where(eq(usersCourses.id, userCourse.id));
        }
        return { success: true, userCourse: null };
      }

      if (!userCourse) {
        const [newUserCourse] = await ctx.db
          .insert(usersCourses)
          .values({
            userId: user.id,
            courseId: courseId,
            status,
            qualification,
            updatedAt: new Date(),
          })
          .returning();
        return { success: true, userCourse: newUserCourse };
      } else {
        const [updatedUserCourse] = await ctx.db
          .update(usersCourses)
          .set({
            status,
            qualification,
            updatedAt: new Date(),
          })
          .where(eq(usersCourses.id, userCourse.id))
          .returning();
        return { success: true, userCourse: updatedUserCourse };
      }
    }),
});
