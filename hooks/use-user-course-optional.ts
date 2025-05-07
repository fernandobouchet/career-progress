import { api } from "@/trpc/react";
import { toast } from "sonner";

interface Props {
  userProgress: UserProgressStatus[];
  setUserProgress: (value: React.SetStateAction<UserProgressStatus[]>) => void;
}

export const useUserCourseOptional = ({
  userProgress,
  setUserProgress,
}: Props) => {
  const updateOptionalCoursesMutation = api.user.setOptativeCourse.useMutation({
    onMutate: async ({ courseId, placeholderCourseId }) => {
      const previousProgress = [...userProgress];

      const existingCourseIndex = previousProgress.findIndex(
        (uc) =>
          uc &&
          uc.courseId !== courseId &&
          uc.placeholderCourseId === placeholderCourseId
      );

      if (existingCourseIndex !== -1) {
        return { previousProgress, courseId };
      }

      setUserProgress((prev) => {
        const existingCourseIndex = prev.findIndex(
          (uc) => uc && uc.courseId === courseId
        );
        const existingCourse =
          existingCourseIndex !== -1 ? prev[existingCourseIndex] : null;

        if (existingCourse) {
          const updatedCourse: UserProgressStatus = {
            ...existingCourse,
            placeholderCourseId: placeholderCourseId,
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
            qualification: null,
            status: "PENDIENTE",
            placeholderCourseId: placeholderCourseId,
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
    updateOptionalCoursesMutation,
  };
};
