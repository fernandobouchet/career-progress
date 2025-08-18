// seed.js
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { careersSeed } from "./seeds/careers";
import { periodsSeed } from "./seeds/periods";
import { sql } from "drizzle-orm";
import { coursesSeed } from "./seeds/shared/courses";
import { licenciaturaInformaticaPeriodCoursesSeed } from "./seeds/careers/licenciatura-informatica/career-periods-courses";
import { tecnicaturaProgramacionPeriodCoursesSeed } from "./seeds/careers/tecnicatura-programacion/career-periods-courses";
import { tecnicaturaInformaticaPeriodCoursesSeed } from "./seeds/careers/tecnicatura-informatica/career-periods-courses";
import { tecnicaturaRedesPeriodCoursesSeed } from "./seeds/careers/tecnicatura-redes/career-periods-courses";
import { tecnicaturaIAPeriodCoursesSeed } from "./seeds/careers/tecnicatura-ia/career-periods-courses";
import { tecnicaturaVideojuegosPeriodCoursesSeed } from "./seeds/careers/tecnicatura-videojuegos/career-periods-courses";
import { sharedCourseCorrelativesSeed } from "./seeds/shared/course-correlatives";
import { sharedCourseOptativesSeed } from "./seeds/shared/course-optatives";

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
        ...tecnicaturaInformaticaPeriodCoursesSeed,
        ...tecnicaturaRedesPeriodCoursesSeed,
        ...tecnicaturaIAPeriodCoursesSeed,
        ...tecnicaturaVideojuegosPeriodCoursesSeed,
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
    // Correlatividades compartidas (incluyen todas las carreras)
    await db
      .insert(schema.correlatives)
      .values(sharedCourseCorrelativesSeed)
      .onConflictDoUpdate({
        target: schema.correlatives.id,
        set: {
          careerId: sql`EXCLUDED.career_id`,
          courseId: sql`EXCLUDED.course_id`,
          requiredCourseId: sql`EXCLUDED.required_course_id`,
        },
      });

    console.log("Insertando/Actualizando optativas...");
    // Optativas compartidas (incluyen todas las carreras)
    await db
      .insert(schema.optatives)
      .values(sharedCourseOptativesSeed)
      .onConflictDoUpdate({
        target: schema.optatives.id,
        set: {
          careerId: sql`EXCLUDED.career_id`,
          courseId: sql`EXCLUDED.course_id`,
          optionCourseId: sql`EXCLUDED.option_course_id`,
        },
      });

    console.log("Insertando/Actualizando equivalencias...");
    //    await db.insert(schema.equivalencyGroups).values(equivalencyGroupsSeeds);
    //  await db.insert(schema.equivalents).values(equivalentsSeeds);

    console.log("Seeds insertados/actualizados correctamente!");
  } catch (error) {
    console.error("Error al insertar seeds:", error);
  }
}

seed();
