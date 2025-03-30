"use client";
import { api } from "@/trpc/react";
import { PeriodsTabs } from "./period-tabs";
import { useEffect, useState } from "react";

interface Props {
  career: Career;
}

const CareerProgramWrapper = ({ career }: Props) => {
  const [enrichedPeriods, setEnrichedPeriods] = useState(career.periods);
  const { data: userCourses, isLoading } =
    api.user.getCourseProgress.useQuery();

  useEffect(() => {
    if (!userCourses || isLoading) {
      setEnrichedPeriods(career.periods);
    } else {
      const enriched = career.periods?.map((period) => {
        const enrichedCourses = period.courses?.map((courses) => {
          const userCourse = userCourses.find(
            (uc) => uc.courseId === courses.course.id
          );
          return {
            ...courses,
            course: {
              ...courses.course,
              progress: userCourse ? userCourse : null,
            },
          };
        });
        return { ...period, courses: enrichedCourses };
      });
      setEnrichedPeriods(enriched);
    }
  }, [userCourses, isLoading, career.periods]);

  console.log(enrichedPeriods, career.periods);

  if (!career.periods || career.periods.length === 0) {
    return null;
  }

  return <PeriodsTabs periods={enrichedPeriods!} />;
};

export { CareerProgramWrapper };
