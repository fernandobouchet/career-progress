// seed.js
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

const careers = [
  {
    id: 1,
    name: "Licenciatura en Informática",
    slug: "licenciatura-informatica",
    isDegree: true, // Licenciatura
    requiredExtraCredits: 0,
  },
  {
    id: 2,
    name: "Tecnicatura en Informática",
    slug: "tecnicatura-informatica",
    isDegree: false, // Tecnicatura
    requiredExtraCredits: 0,
  },
  {
    id: 3,
    name: "Tecnicatura en Programación",
    slug: "tecnicatura-programacion",
    isDegree: false, // Tecnicatura
    requiredExtraCredits: 30,
  },
  {
    id: 4,
    name: "Tecnicatura en Redes y Operaciones Informáticas",
    slug: "tecnicatura-redes",
    isDegree: false, // Tecnicatura
    requiredExtraCredits: 30,
  },
  {
    id: 5,
    name: "Tecnicatura en Inteligencia Artificial",
    slug: "tecnicatura-ia",
    isDegree: false, // Tecnicatura
    requiredExtraCredits: 30,
  },

  {
    id: 6,
    name: "Tecnicatura en Videojuegos",
    slug: "tecnicatura-videojuegos",
    isDegree: false, // Tecnicatura
    requiredExtraCredits: 30,
  },
];

const periods = [
  { id: 1, order: 1, careerId: 1 },
  { id: 2, order: 2, careerId: 1 },
  { id: 3, order: 3, careerId: 1 },
  { id: 4, order: 1, careerId: 2 },
  { id: 5, order: 2, careerId: 2 },
];

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
    console.log("Insertando carreras...");
    await db.insert(schema.careers).values(careers).onConflictDoNothing();

    console.log("Insertando períodos...");
    await db.insert(schema.periods).values(periods).onConflictDoNothing();

    console.log("Insertando cursos...");
    await db.insert(schema.courses).values(courses).onConflictDoNothing();

    console.log("Insertando relaciones carreras-cursos...");
    await db
      .insert(schema.careersCourses)
      .values(careersCourses)
      .onConflictDoNothing();

    console.log("Seeds insertados correctamente!");
  } catch (error) {
    console.error("Error al insertar seeds:", error);
  }
}

seed();
