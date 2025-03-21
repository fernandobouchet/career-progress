enum rolesEnum {
  "ADMIN",
  "USER",
  "MOD",
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
};
