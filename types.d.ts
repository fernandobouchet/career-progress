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
