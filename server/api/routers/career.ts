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
        .where(eq(careers.slug, slug))
        .limit(1);

      return career[0] || null;
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
