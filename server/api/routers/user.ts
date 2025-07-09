import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { usersCourses, usersCareers } from "@/server/db/schema";
import { statusKeys } from "@/types/constants";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getCourseProgress: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const userCourses = await ctx.db.query.usersCourses.findMany({
      where: (usersCourses, { eq }) => eq(usersCourses.userId, user.id),
    });
    return userCourses;
  }),

  getUserCareers: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const userCareers = await ctx.db.query.usersCareers.findMany({
      where: (usersCareers, { eq }) => eq(usersCareers.userId, user.id),
      with: {
        career: true,
      },
    });

    return userCareers.map((uc) => uc.career);
  }),

  updateUserCareers: protectedProcedure
    .input(
      z.object({
        careerIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input: { careerIds }, ctx }) => {
      const user = ctx.session.user;

      // Eliminar todas las carreras actuales del usuario
      await ctx.db.delete(usersCareers).where(eq(usersCareers.userId, user.id));

      // Insertar las nuevas carreras seleccionadas
      if (careerIds.length > 0) {
        await ctx.db.insert(usersCareers).values(
          careerIds.map((careerId) => ({
            userId: user.id,
            careerId,
          }))
        );
      }

      return { success: true };
    }),

  deleteCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ input: { courseId }, ctx }) => {
      const user = ctx.session.user;

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, courseId),
      });

      if (!course)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asignatura no encontrada.",
        });

      const userCourse = await ctx.db.query.usersCourses.findFirst({
        where: (uc, { and, eq }) =>
          and(eq(uc.userId, user.id), eq(uc.courseId, courseId)),
      });
      if (!userCourse)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Progreso de la asignatura no encontrado.",
        });

      const blockingCourses = await ctx.db.query.correlatives.findMany({
        where: (course, { eq }) => eq(course.requiredCourseId, courseId),
        with: {
          course: {
            with: {
              progress: {
                where: (users, { eq }) => eq(users.userId, user.id),
              },
            },
          },
        },
      });

      const progressedCourses = blockingCourses
        .filter((c) => {
          const status = c.course.progress[0]?.status;
          return status !== "PENDIENTE";
        })
        .map((c) => ({
          id: c.course.id,
          name: c.course.name,
          status: c.course.progress[0]?.status,
        }));

      if (progressedCourses.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "No es posible eliminar el progreso de esta asignatura porque es requerida por otras que ya tienen un progreso guardado.",
        });
      }

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
      const user = ctx.session.user;

      const course = await ctx.db.query.courses.findFirst({
        where: (courses, { eq }) => eq(courses.id, courseId),
      });

      if (!course)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asignatura no encontrada.",
        });

      const existingOptativeUserCourse =
        await ctx.db.query.usersCourses.findFirst({
          where: (uc, { and, eq }) =>
            and(
              eq(uc.userId, user.id),
              eq(uc.placeholderCourseId, placeholderCourseId)
            ),
        });

      if (existingOptativeUserCourse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "No puedes asignar esta asignatura optativa porque ya está asignada en otra asignatura.",
        });
      }

      const [userCourse] = await ctx.db
        .insert(usersCourses)
        .values({
          userId: user.id,
          courseId,
          placeholderCourseId,
          qualification: null,
        })
        .onConflictDoUpdate({
          target: [usersCourses.userId, usersCourses.courseId],
          set: {
            placeholderCourseId,
          },
        })
        .returning();

      return { success: true, userCourse };
    }),

  updateCourseProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        status: z.enum(statusKeys),
        qualification: z.number().min(4).max(10).nullable(),
        approvedDate: z.date().nullable().optional(),
      })
    )
    .mutation(
      async ({
        input: { courseId, status, qualification, approvedDate },
        ctx,
      }) => {
        const user = ctx.session.user;

        const course = await ctx.db.query.courses.findFirst({
          where: (courses, { eq }) => eq(courses.id, courseId),
        });

        if (!course)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Asignatura no encontrada.",
          });

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
          return { success: true };
        }

        if (!userCourse) {
          const [newUserCourse] = await ctx.db
            .insert(usersCourses)
            .values({
              userId: user.id,
              courseId: courseId,
              status,
              qualification: status === "APROBADA" ? qualification : null,
              approvedDate: status === "APROBADA" ? approvedDate : null,
            })
            .returning();
          return { success: true, userCourse: newUserCourse };
        } else {
          const [updatedUserCourse] = await ctx.db
            .update(usersCourses)
            .set({
              status,
              qualification: status === "APROBADA" ? qualification : null,
              updatedAt: new Date(),
              approvedDate: status === "APROBADA" ? approvedDate : null,
            })
            .where(eq(usersCourses.id, userCourse.id))
            .returning();
          return { success: true, userCourse: updatedUserCourse };
        }
      }
    ),
});
