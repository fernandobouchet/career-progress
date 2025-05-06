import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { usersCourses } from "@/server/db/schema";
import { statusKeys } from "@/types/constants";
import { TRPCError } from "@trpc/server";
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
  deleteCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ input: { courseId }, ctx }) => {
      const user = ctx.session?.user;
      if (!user) return { success: false, error: "Usuario no autenticado." };

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, courseId),
      });

      if (!course)
        return { success: false, error: "Asignatura no encontrada." };

      const userCourse = await ctx.db.query.usersCourses.findFirst({
        where: (uc, { and, eq }) =>
          and(eq(uc.userId, user.id), eq(uc.courseId, courseId)),
      });
      if (!userCourse)
        return {
          success: false,
          error: "Progreso de la asignatura no encontrado.",
        };

      await ctx.db
        .delete(usersCourses)
        .where(eq(usersCourses.id, userCourse.id));
      return { success: true };
    }),
  setOptativeCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        placeholderCourseId: z.number(),
      })
    )
    .mutation(async ({ input: { courseId, placeholderCourseId }, ctx }) => {
      const user = ctx.session?.user;
      if (!user) return { success: false, error: "Usuario no autenticado." };

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, courseId),
      });

      if (!course)
        return { success: false, error: "Asignatura no encontrada." };

      const existingOptativeUserCourse =
        await ctx.db.query.usersCourses.findFirst({
          where: (uc, { and, eq }) =>
            and(
              eq(uc.userId, user.id),
              eq(uc.placeholderCourseId, placeholderCourseId)
            ),
        });

      if (existingOptativeUserCourse) {
        return {
          success: false,
          error: "La asignatura optativa ya está asignada en otra asignatura.",
        };
      }

      const [userCourse] = await ctx.db
        .insert(usersCourses)
        .values({
          userId: user.id,
          courseId,
          placeholderCourseId,
          status: "PENDIENTE",
          qualification: null,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [usersCourses.userId, usersCourses.courseId],
          set: {
            placeholderCourseId,
            updatedAt: new Date(),
          },
        })
        .returning();

      return { success: true, userCourse };
    }),

  updateCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        placeholderCourseId: z.number().nullable(),
        status: z.enum(statusKeys),
        qualification: z.number().min(4).max(10).nullable(),
      })
    )
    .mutation(
      async ({
        input: { courseId, placeholderCourseId, status, qualification },
        ctx,
      }) => {
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

        if (status !== "PENDIENTE") {
          const correlatives = await ctx.db.query.correlatives.findMany({
            where: (c, { eq }) => eq(c.courseId, courseId),
          });

          if (correlatives.length > 0) {
            const userCorrelatives = await ctx.db.query.usersCourses.findMany({
              where: (uc, { and, eq, inArray }) =>
                and(
                  eq(uc.userId, user.id),
                  inArray(
                    uc.courseId,
                    correlatives.map((c) => c.requiredCourseId)
                  )
                ),
            });

            const allCorrelativesPassed = correlatives.every((correlative) =>
              userCorrelatives.some(
                (uc) =>
                  uc.courseId === correlative.requiredCourseId &&
                  (uc.status === "APROBADA" || uc.status === "REGULARIZADA")
              )
            );

            if (!allCorrelativesPassed) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message:
                  "No puedes cambiar el estado de esta materia porque no tenés todas las correlativas aprobadas o regularizadas.",
              });
            }
          }
        }

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
              placeholderCourseId,
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
              placeholderCourseId,
              status,
              qualification,
              updatedAt: new Date(),
            })
            .where(eq(usersCourses.id, userCourse.id))
            .returning();
          return { success: true, userCourse: updatedUserCourse };
        }
      }
    ),
});
