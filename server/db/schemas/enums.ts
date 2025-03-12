import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MOD", "USER"]);

export const coursesStatusEnum = pgEnum("course_status", [
  "CURSANDO",
  "PENDIENTE",
  "REGULARIZADA",
  "APROBADA",
]);

export const reviewsStatusEnum = pgEnum("review_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
