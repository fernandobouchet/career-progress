import { z } from "zod";

import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { careers } from "@/server/db/schema";

export const careerRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input: { slug }, ctx }) => {
      const career = await ctx.db.query.careers.findFirst({
        where: (careers, { eq }) => eq(careers.slug, slug),
        with: {
          periods: {
            orderBy: (periods, { asc }) => asc(periods.order),
            with: {
              courses: {
                with: {
                  course: {
                    with: {
                      correlatives: {
                        with: {
                          requiredCourse: {
                            columns: {
                              id: true,
                              name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!career) return null;

      return career;
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
});
