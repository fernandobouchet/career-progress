import { z } from "zod";

import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { careers } from "@/server/db/schema";

export const careerRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx }) => {
      const user = await ctx.session?.user;
      const career = await ctx.db.query.careers.findFirst({
        where: (careers, { eq }) => eq(careers.slug, slug),
        with: {
          periods: {
            orderBy: (periods, { asc }) => asc(periods.order),
            with: {
              courses: {
                with: {
                  course: {},
                },
              },
            },
          },
        },
      });

      if (!career) return null;

      const periods = await Promise.all(
        career.periods.map(async (period) => {
          const courses = await Promise.all(
            period.courses.map(async (c) => {
              const course = c.course;

              // Si el usuario está logueado, obtener el estado de la materia
              let userStatus = null;
              if (user) {
                const userCourse = await ctx.db.query.usersCourses.findFirst({
                  where: (uc, { and, eq }) =>
                    and(eq(uc.userId, user.id), eq(uc.courseId, course.id)),
                });
                userStatus = userCourse ? userCourse.status : "PENDIENTE";
              }

              return {
                ...course,
                status: userStatus, // null si no está logueado, estado si sí lo está
              };
            })
          );

          return {
            ...period,
            courses,
          };
        })
      );

      return { ...career, periods };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id }, ctx }) => {
      const career = await ctx.db
        .select({
          id: careers.id,
          name: careers.name,
          slug: careers.slug,
          isDegree: careers.isDegree,
          parentCareerId: careers.parentCareerId,
          requiredExtraCredits: careers.requiredExtraCredits,
        })
        .from(careers)
        .where(eq(careers.id, id))
        .limit(1);

      return career[0] || null;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: careers.id,
        name: careers.name,
        slug: careers.slug,
        isDegree: careers.isDegree,
        parentCareerId: careers.parentCareerId,
        requiredExtraCredits: careers.requiredExtraCredits,
      })
      .from(careers);
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
