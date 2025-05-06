"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useUserProgressMap } from "@/hooks/use-user-progress-map";
import { Session } from "next-auth";

type UserDataContextType = {
  userProgress: UserProgressStatus[];
  updateCourseStatus: (params: UpdateUserProgressStatus) => void;
  updateOptionalCourse: (params: UpdateOptionalCourse) => void;
  deleteCourseProgress: (courseId: number) => void;
  areCourseCorrelativesPassed: (course: Course) => boolean;
  getUnmetCorrelatives: (course: Course) => RequiredCourse[];
  isLoading: boolean;
  isSaving: boolean;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const [userProgress, setUserProgress] = useState<UserProgressStatus[]>([]);

  const { data: initialUserCourses, isLoading: isLoadingCourses } =
    api.user.getCourseProgress.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!session,
    });

  const updateUserCoursesMutation = api.user.updateCourseProgress.useMutation({
    onMutate: async ({ courseId, status, qualification }) => {
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
      toast.error("Error al actualizar el progreso en la base de datos");
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
        toast.error(
          "La asignatura optativa seleccionada ya está asignado en otra asignatura."
        );
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
      toast.error("Error al actualizar el progreso en la base de datos");
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

  const deleteCourseProgressMutation =
    api.user.deleteCourseProgress.useMutation({
      onMutate: async ({ courseId }) => {
        const previousProgress = [...userProgress];

        const existingCourseIndex = previousProgress.findIndex(
          (uc) => uc && uc.courseId === courseId
        );

        if (existingCourseIndex === -1) {
          toast.error(
            "No se encontró un progreso registrado en la asignatura."
          );
          return { previousProgress };
        }

        setUserProgress((prev) =>
          prev.filter((uc) => uc?.courseId !== courseId)
        );

        return { previousProgress };
      },

      onError: (_err, _variables, context) => {
        setUserProgress(
          (context as { previousProgress: UserProgressStatus[] })
            .previousProgress
        );
        toast.error("Error al eliminar el progreso de la base de datos");
      },

      onSuccess: (data) => {
        if (!data?.success) {
          toast.error("No se pudo eliminar el progreso.");
          return;
        }
        toast.success("Progreso eliminado correctamente.");
      },
    });

  useEffect(() => {
    if (initialUserCourses) {
      setUserProgress(initialUserCourses as UserProgressStatus[]);
    }
  }, [initialUserCourses]);

  const userProgressMap = useUserProgressMap(userProgress);

  const updateCourseStatus = useCallback(
    ({
      courseId,
      placeholderCourseId,
      status,
      qualification,
    }: UpdateUserProgressStatus) => {
      updateUserCoursesMutation.mutate({
        courseId,
        placeholderCourseId,
        status,
        qualification,
      });
    },
    [updateUserCoursesMutation]
  );

  const updateOptionalCourse = useCallback(
    ({ courseId, placeholderCourseId }: UpdateOptionalCourse) => {
      updateOptionalCoursesMutation.mutate({
        courseId,
        placeholderCourseId,
      });
    },
    [updateOptionalCoursesMutation]
  );

  const deleteCourseProgress = useCallback(
    (courseId: number) => {
      deleteCourseProgressMutation.mutate({
        courseId,
      });
    },
    [deleteCourseProgressMutation]
  );

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

  const contextValue = useMemo(
    () => ({
      userProgress,
      updateCourseStatus,
      updateOptionalCourse,
      deleteCourseProgress,
      areCourseCorrelativesPassed,
      getUnmetCorrelatives,
      isLoading: isLoadingCourses,
      isSaving: updateUserCoursesMutation.isPending,
    }),
    [
      userProgress,
      updateCourseStatus,
      updateOptionalCourse,
      deleteCourseProgress,
      areCourseCorrelativesPassed,
      getUnmetCorrelatives,
      isLoadingCourses,
      updateUserCoursesMutation.isPending,
    ]
  );

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
