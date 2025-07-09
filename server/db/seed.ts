// seed.js
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { careersSeed } from "./seeds/careers";
import { periodsSeed } from "./seeds/periods";
import { sql } from "drizzle-orm";
import { coursesSeed } from "./seeds/shared/courses";
import { licenciaturaInformaticaCourseCorrelativesSeed } from "./seeds/careers/licenciatura-informatica/course-correlatives";
import { licenciaturaInformaticaCourseOptativesSeed } from "./seeds/careers/licenciatura-informatica/course-optatives";
import { licenciaturaInformaticaPeriodCoursesSeed } from "./seeds/careers/licenciatura-informatica/career-periods-courses";
import { tecnicaturaProgramacionPeriodCoursesSeed } from "./seeds/careers/tecnicatura-programacion/career-periods-courses";
import { courseEquivalentsSeeds } from "./seeds/course-equivalents";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

async function seed() {
  try {
    await db.delete(schema.careers);
    await db.delete(schema.periods);
    await db.delete(schema.courses);
    await db.delete(schema.careersCourses);
    await db.delete(schema.correlatives);
    await db.delete(schema.optatives);
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

    console.log(
      "Insertando/Actualizando cursos en los periodos de las carreras..."
    );
    await db
      .insert(schema.careersCourses)
      .values([
        ...licenciaturaInformaticaPeriodCoursesSeed,
        ...tecnicaturaProgramacionPeriodCoursesSeed,
      ])
      .onConflictDoUpdate({
        target: schema.careersCourses.id,
        set: {
          careerId: sql`EXCLUDED.career_id`,
          courseId: sql`EXCLUDED.course_id`,
          periodId: sql`EXCLUDED.period_id`,
        },
      });

    console.log("Insertando/Actualizando correlatividades...");
    await db
      .insert(schema.correlatives)
      .values(licenciaturaInformaticaCourseCorrelativesSeed);

    console.log("Insertando/Actualizando optativas...");
    await db
      .insert(schema.optatives)
      .values(licenciaturaInformaticaCourseOptativesSeed);

    await db.insert(schema.courseEquivalenceGroups).values({
      id: "eq-matematica-1",
      careerId: 1,
    });

    await db.insert(schema.equivalents).values(courseEquivalentsSeeds);

    console.log("Seeds insertados/actualizados correctamente!");
  } catch (error) {
    console.error("Error al insertar seeds:", error);
  }
}

seed();
