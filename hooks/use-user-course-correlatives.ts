import { useUserProgressMap } from "@/hooks/use-user-progress-map";
import { useCallback } from "react";

export const useUserCourseCorrelatives = (
  userProgress: UserProgressStatus[]
) => {
  const userProgressMap = useUserProgressMap(userProgress);

  const areCourseCorrelativesPassed = useCallback(
    (course: Course) => {
      return (
        course.correlatives?.every((correlative) => {
          const progress = userProgressMap.get(correlative.requiredCourse.id);
          return (
            progress?.status === "APROBADA" ||
            progress?.status === "REGULARIZADA"
          );
        }) ?? true
      );
    },
    [userProgressMap]
  );

  const getUnmetCorrelatives = useCallback(
    (course: Course) => {
      const courseCorrelatives = course.correlatives;
      const unmetCorrelatives: RequiredCourse[] = [];

      if (!courseCorrelatives || courseCorrelatives.length === 0) {
        return unmetCorrelatives;
      }

      for (const correlative of courseCorrelatives) {
        const requiredCourse = correlative.requiredCourse;
        const progress = userProgressMap.get(requiredCourse.id);

        const isPassed =
          progress?.status === "APROBADA" ||
          progress?.status === "REGULARIZADA";

        if (!isPassed) {
          unmetCorrelatives.push({
            requiredCourse: {
              id: requiredCourse.id,
              name: requiredCourse.name,
            },
          });
        }
      }

      return unmetCorrelatives;
    },
    [userProgressMap]
  );

  return { areCourseCorrelativesPassed, getUnmetCorrelatives };
};
