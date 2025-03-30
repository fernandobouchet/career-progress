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
  parentOptionId: number | null;
  progress?: UserStatus;
};

type UserStatus = {
  id: string;
  userId: string;
  courseId: number;
  qualification: number | null;
  status: keyof typeof StatusEnum;
  updatedAt: Date;
} | null;

type ProgressForm = {
  status: keyof typeof StatusEnum;
  qualification: number | null;
};
