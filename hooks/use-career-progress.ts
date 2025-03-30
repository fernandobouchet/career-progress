"use client";
import { useState, useEffect } from "react";
import { useUserData } from "@/context/user-data-context";

export function useCareerProgress(career: Career): Period[] {
  const [periodsWithProgress, setPeriodsWithProgress] = useState<Period[]>(
    career.periods || []
  );
  const { userProgress } = useUserData();

  useEffect(() => {
    if (!career.periods) {
      setPeriodsWithProgress([]);
      return;
    }

    const updatedPeriods = career.periods.map((period) => {
      const updatedCourses = (period.courses || []).map(
        (courseRelation: CourseRelation) => {
          const userCourse = userProgress.find(
            (userProgress) =>
              userProgress && userProgress.courseId === courseRelation.course.id
          );
          return {
            ...courseRelation,
            course: {
              ...courseRelation.course,
              progress: userCourse || null,
            },
          };
        }
      );
      return { ...period, courses: updatedCourses };
    });

    setPeriodsWithProgress(updatedPeriods);
  }, [userProgress, career.periods]);

  return periodsWithProgress;
}
