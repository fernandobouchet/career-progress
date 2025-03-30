"use client";
import { PeriodsTabs } from "./period-tabs";
import { useCareerProgress } from "@/hooks/use-career-progress";

interface Props {
  career: Career;
}

const CareerProgramWrapper = ({ career }: Props) => {
  const periodsWithProgress = useCareerProgress(career);

  if (!career.periods || career.periods.length === 0) {
    return null;
  }

  return <PeriodsTabs periods={periodsWithProgress} />;
};

export { CareerProgramWrapper };
