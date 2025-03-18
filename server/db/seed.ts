// seed.js
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { careers } from "./seeds/careers";
import { periods } from "./seeds/periods";
import { sql } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

const courses = [
  { id: 1, name: "Matemáticas I", hsWeekly: 4, hsTotal: 64 },
  { id: 2, name: "Física I", hsWeekly: 4, hsTotal: 64 },
  { id: 3, name: "Programación I", hsWeekly: 6, hsTotal: 96 },
  { id: 4, name: "Introducción a la Programación", hsWeekly: 5, hsTotal: 80 },
  { id: 5, name: "Bases de Datos", hsWeekly: 4, hsTotal: 64 },
];

const careersCourses = [
  { id: "cc-1", careerId: 1, courseId: 1, isObligatory: true, periodId: 1 },
  { id: "cc-2", careerId: 1, courseId: 2, isObligatory: true, periodId: 1 },
  { id: "cc-3", careerId: 1, courseId: 3, isObligatory: true, periodId: 2 },
  { id: "cc-4", careerId: 2, courseId: 4, isObligatory: true, periodId: 4 },
  { id: "cc-5", careerId: 2, courseId: 5, isObligatory: true, periodId: 5 },
];

async function seed() {
  try {
    console.log("Insertando/Actualizando carreras...");
    await db
      .insert(schema.careers)
      .values(careers)
      .onConflictDoUpdate({
        target: schema.careers.id,
        set: {
          name: sql`EXCLUDED.name`,
          slug: sql`EXCLUDED.slug`,
          isDegree: sql`EXCLUDED.is_degree`,
          parentCareerId: sql`EXCLUDED.parent_career_id`,
          requiredExtraCredits: sql`EXCLUDED.required_extra_credits`,
        },
      });

    console.log("Insertando/Actualizando períodos...");
    await db
      .insert(schema.periods)
      .values(periods)
      .onConflictDoUpdate({
        target: schema.periods.id,
        set: {
          order: sql`EXCLUDED.order`,
          careerId: sql`EXCLUDED.career_id`,
        },
      });

    console.log("Insertando/Actualizando cursos...");
    await db
      .insert(schema.courses)
      .values(courses)
      .onConflictDoUpdate({
        target: schema.courses.id,
        set: {
          name: sql`EXCLUDED.name`,
          hsWeekly: sql`EXCLUDED.hs_weekly`,
          hsTotal: sql`EXCLUDED.hs_total`,
        },
      });

    console.log("Insertando/Actualizando relaciones carreras-cursos...");
    await db
      .insert(schema.careersCourses)
      .values(careersCourses)
      .onConflictDoUpdate({
        target: schema.careersCourses.id,
        set: {
          careerId: sql`EXCLUDED.career_id`,
          courseId: sql`EXCLUDED.course_id`,
          periodId: sql`EXCLUDED.period_id`,
        },
      });

    console.log("Seeds insertados/actualizados correctamente!");
  } catch (error) {
    console.error("Error al insertar seeds:", error);
  }
}

seed();
