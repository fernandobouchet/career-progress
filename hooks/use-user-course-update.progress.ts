import { api } from "@/trpc/react";
import { toast } from "sonner";

interface Props {
  userProgress: UserProgressStatus[];
  setUserProgress: (value: React.SetStateAction<UserProgressStatus[]>) => void;
}

export const useUserCourseUpdateProgress = ({
  userProgress,
  setUserProgress,
}: Props) => {
  const updateUserCourseMutation = api.user.updateCourseProgress.useMutation({
    onMutate: async ({ courseId, status, qualification, approvedDate }) => { // Added approvedDate
      const previousProgress = [...userProgress];
      setUserProgress((prev) => {
        const existingCourseIndex = prev.findIndex(
          (uc) => uc && uc.courseId === courseId
        );
        const existingCourse =
          existingCourseIndex !== -1 ? prev[existingCourseIndex] : null;

        if (status === "PENDIENTE") {
          return existingCourseIndex !== -1
            ? prev.filter((uc) => uc && uc.courseId !== courseId)
            : prev;
        }

        if (existingCourse) {
          const updatedCourse: UserProgressStatus = {
            ...existingCourse,
            status,
            qualification,
            approvedDate: approvedDate ?? existingCourse.approvedDate, // Added approvedDate
            updatedAt: new Date(),
          };
          return prev.map((uc, index) =>
            index === existingCourseIndex ? updatedCourse : uc
          );
        } else {
          const newCourse: UserProgressStatus = {
            id: "",
            userId: "",
            courseId,
            placeholderCourseId: null,
            status,
            qualification,
            approvedDate: approvedDate ?? null, // Added approvedDate
            updatedAt: new Date(),
          };
          return [...prev, newCourse];
        }
      });
      return { previousProgress, courseId };
    },
    onError: (err, variables, context) => {
      setUserProgress(
        (context as { previousProgress: UserProgressStatus[] }).previousProgress
      );
      toast.error(err.message);
    },
    onSuccess: (data, variables) => {
      if (data?.success) {
        setUserProgress((prev: UserProgressStatus[]) => {
          const courseId = variables.courseId;
          if (data.userCourse === null) {
            return prev.filter(
              (uc) => uc?.courseId !== courseId
            ) as UserProgressStatus[];
          }
          const existingCourseIndex = prev.findIndex(
            (uc) => uc?.courseId === courseId
          );
          const updatedCourse = data.userCourse as UserProgressStatus;
          if (existingCourseIndex !== -1) {
            return prev.map((uc, index) =>
              index === existingCourseIndex ? updatedCourse : uc
            );
          } else {
            return [...prev, updatedCourse];
          }
        });
      }
    },
  });

  return {
    updateUserCourseMutation,
  };
};
