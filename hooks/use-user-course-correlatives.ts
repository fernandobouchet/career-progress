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

  const getCorrelativesStatus = useCallback(
    (course: Course) => {
      const pending: RequiredCourse[] = [];
      const passed: RequiredCourse[] = [];

      for (const correlative of course.correlatives ?? []) {
        const requiredCourse = correlative.requiredCourse;
        const progress = userProgressMap.get(requiredCourse.id);

        const isPassed =
          progress?.status === "APROBADA" ||
          progress?.status === "REGULARIZADA";

        const entry = {
          requiredCourse: { id: requiredCourse.id, name: requiredCourse.name },
        };

        if (!isPassed) {
          pending.push(entry);
        } else {
          passed.push(entry);
        }
      }

      return { pending, passed };
    },
    [userProgressMap]
  );

  return { areCourseCorrelativesPassed, getCorrelativesStatus };
};
