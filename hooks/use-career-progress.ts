import { useUserData } from "@/context/user-data-context";
import { useEffect, useState } from "react";

export function useCareerProgress(career: Career): Period[] {
  const [periodsWithProgress, setPeriodsWithProgress] = useState<Period[]>([]);
  const { userProgress } = useUserData();

  useEffect(() => {
    if (!career.periods) {
      setPeriodsWithProgress([]);
      return;
    }

    const dependencyMap: Record<number, { id: number; name: string }[]> = {};

    for (const period of career.periods) {
      for (const relation of period.courses || []) {
        const course = relation.course;
        for (const correlative of course.correlatives || []) {
          const requiredCourse = correlative.requiredCourse;
          if (!dependencyMap[requiredCourse.id]) {
            dependencyMap[requiredCourse.id] = [];
          }
          dependencyMap[requiredCourse.id].push({
            id: course.id,
            name: course.name,
          });
        }
      }
    }

    const updatedPeriods = career.periods.map((period) => {
      const updatedCourses = (period.courses || []).map((courseRelation) => {
        const course = courseRelation.course;
        const userCourse = userProgress.find((p) => p?.courseId === course.id);

        const dependentCourses = dependencyMap[course.id] || [];

        return {
          ...courseRelation,
          course: {
            ...course,
            progress: userCourse || null,
            dependents: dependentCourses,
          },
        };
      });

      return { ...period, courses: updatedCourses };
    });

    setPeriodsWithProgress(updatedPeriods);
  }, [userProgress, career.periods]);

  return periodsWithProgress;
}
