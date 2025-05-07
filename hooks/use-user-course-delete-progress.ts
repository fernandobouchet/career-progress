import { api } from "@/trpc/react";
import { toast } from "sonner";

interface Props {
  userProgress: UserProgressStatus[];
  setUserProgress: (value: React.SetStateAction<UserProgressStatus[]>) => void;
}

export const useUserCourseDeleteProgress = ({
  userProgress,
  setUserProgress,
}: Props) => {
  const deleteCourseProgressMutation =
    api.user.deleteCourseProgress.useMutation({
      onMutate: async ({ courseId }) => {
        const previousProgress = [...userProgress];

        const existingCourseIndex = previousProgress.findIndex(
          (uc) => uc && uc.courseId === courseId
        );

        if (existingCourseIndex === -1) {
          return { previousProgress };
        }

        setUserProgress((prev) =>
          prev.filter((uc) => uc?.courseId !== courseId)
        );

        return { previousProgress };
      },

      onError: (err, _variables, context) => {
        setUserProgress(
          (context as { previousProgress: UserProgressStatus[] })
            .previousProgress
        );
        toast.error(err.message);
      },

      onSuccess: (data) => {
        if (!data.success) {
          toast.error("No se pudo eliminar el progreso de la asignatura.");
          return;
        }
      },
    });

  return {
    deleteCourseProgressMutation,
  };
};
