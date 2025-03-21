// seed.js
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { careersSeed } from "./seeds/careers";
import { periodsSeed } from "./seeds/periods";
import { sql } from "drizzle-orm";
import { coursesSeed } from "./seeds/courses";
import { careersCoursesSeed } from "./seeds/career_courses";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

async function seed() {
  try {
    await db.delete(schema.careers);
    await db.delete(schema.periods);
    await db.delete(schema.courses);
    await db.delete(schema.careersCourses);
    console.log("Insertando/Actualizando carreras...");
    await db
      .insert(schema.careers)
      .values(careersSeed)
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
      .values(periodsSeed)
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
      .values(coursesSeed)
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
      .values(careersCoursesSeed)
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
