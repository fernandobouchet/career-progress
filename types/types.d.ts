enum rolesEnum {
  "ADMIN",
  "USER",
  "MOD",
}

enum statusEnum {
  "PENDIENTE",
  "CURSANDO",
  "REGULARIZADA",
  "APROBADA",
}

type career = {
  id: number;
  name: string;
  slug: string;
  isDegree: boolean;
  parentCareerId: number | null;
  requiredExtraCredits: number | null;
};

type period = {
  id: number;
  careerId: number;
  order: number;
  courses?: courses[];
};

type courses = {
  id: string;
  courseId: number;
  careerId: number;
  courseId: number;
  periodId: number | null;
  course: course;
};

type course = {
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
  progress?: userStatus;
};

type userStatus = {
  id: string;
  userId: string;
  courseId: number;
  careerId: number;
  qualification: number | null;
  status: keyof typeof statusEnum;
  updatedAt: Date;
} | null;

type progressForm = {
  status: keyof typeof statusEnum;
  qualification: number | null;
};
