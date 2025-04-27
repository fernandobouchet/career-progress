import { useMemo } from "react";

export function useUserProgressMap(userProgress: UserProgressStatus[]) {
  return useMemo(() => {
    const map = new Map<number, UserProgressStatus>();
    for (const userCourse of userProgress) {
      if (userCourse) {
        map.set(userCourse.courseId, userCourse);
      }
    }
    return map;
  }, [userProgress]);
}
