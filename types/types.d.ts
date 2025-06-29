enum RolesEnum {
  ADMIN = "ADMIN",
  USER = "USER",
  MOD = "MOD",
}

enum StatusEnum {
  PENDIENTE = "PENDIENTE",
  CURSANDO = "CURSANDO",
  REGULARIZADA = "REGULARIZADA",
  APROBADA = "APROBADA",
}

type Career = {
  id: number;
  name: string;
  slug: string;
  isDegree: boolean;
  parentCareerId: number | null;
  requiredExtraCredits: number | null;
  periods?: Period[];
};

type Period = {
  id: number;
  careerId: number;
  order: number;
  courses?: CourseRelation[];
};

type CourseRelation = {
  courseId: number;
  periodId: number | null;
  course: Course;
};

type Course = {
  id: number;
  name: string;
  info: string | null;
  infoUrl: string | null;
  area: string | null;
  hsWeekly: number | null;
  hsTotal: number | null;
  code: string | null;
  isPlaceholder: boolean;
  progress?: UserProgressStatus;
  correlatives?: RequiredCourse[];
  optatives?: OptionalCourse[];
  dependents?: CourseIdAndName[];
};

type RequiredCourse = {
  requiredCourse: CourseIdAndName;
};

type OptionalCourse = {
  optionCourse: Course;
};

type CourseIdAndName = Pick<Course, "id" | "name">;

type UpdateOptionalCourse = {
  courseId: number;
  placeholderCourseId: number;
};

type UserProgressStatus = {
  id: string;
  userId: string;
  courseId: number;
  placeholderCourseId: number | null;
  qualification: number | null;
  status: keyof typeof StatusEnum;
  approvedDate?: Date | null; // Added approvedDate
  updatedAt: Date;
} | null;

type UpdateUserProgressStatus = {
  courseId: number;
  placeholderCourseId?: number | null;
  qualification: number | null;
  status: keyof typeof StatusEnum;
  approvedDate?: Date | null; // Added approvedDate
};

type ProgressForm = {
  status: keyof typeof StatusEnum;
  qualification: number | null;
};
