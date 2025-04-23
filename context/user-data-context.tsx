"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type UserDataContextType = {
  userProgress: UserStatus[];
  updateCourseStatus: (
    courseId: number,
    status: keyof typeof StatusEnum,
    qualification?: number | null
  ) => void;
  areCourseCorrelativesPassed: (course: Course) => boolean;
  getUnmetCorrelatives: (course: Course) => CourseIdAndName[];
  isLoading: boolean;
  isSaving: boolean;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserStatus[]>([]);

  const { data: initialUserCourses, isLoading: isLoadingCourses } =
    api.user.getCourseProgress.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const updateUserCoursesMutation = api.user.updateCourseProgress.useMutation({
    onMutate: async ({ courseId, status, qualification }) => {
      const previousProgress = userProgress;
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
          const updatedCourse: UserStatus = {
            id: existingCourse.id,
            userId: existingCourse.userId,
            courseId: existingCourse.courseId,
            status,
            qualification,
            updatedAt: new Date(),
          };
          return prev.map((uc, index) =>
            index === existingCourseIndex ? updatedCourse : uc
          );
        } else {
          const newCourse: UserStatus = {
            id: "", // Placeholder, será reemplazado en onSuccess
            userId: "",
            courseId,
            status,
            qualification,
            updatedAt: new Date(),
          };
          return [...prev, newCourse];
        }
      });
      return { previousProgress, courseId }; // Capturo courseId para usarlo en onSuccess
    },
    onError: (err, variables, context) => {
      setUserProgress(
        (context as { previousProgress: UserStatus[] }).previousProgress
      );
      toast.error("Error al actualizar el progreso en la base de datos");
    },
    onSuccess: (data, variables) => {
      if (data?.success) {
        setUserProgress((prev: UserStatus[]) => {
          const courseId = variables.courseId;
          if (data.userCourse === null) {
            // Filtramos explícitamente para devolver UserStatus[]
            return prev.filter(
              (uc) => uc?.courseId !== courseId
            ) as UserStatus[];
          }
          const existingCourseIndex = prev.findIndex(
            (uc) => uc?.courseId === courseId
          );
          const updatedCourse = data.userCourse as UserStatus; // Aseguramos el tipo
          if (existingCourseIndex !== -1) {
            return prev.map((uc, index) =>
              index === existingCourseIndex ? updatedCourse : uc
            );
          } else {
            return [...prev, updatedCourse];
          }
        });
      } else {
        toast.error("La mutación no fue exitosa");
      }
    },
  });

  useEffect(() => {
    if (initialUserCourses) {
      setUserProgress(initialUserCourses as UserStatus[]);
    }
  }, [initialUserCourses]);

  const updateCourseStatus = (
    courseId: number,
    status: keyof typeof StatusEnum,
    qualification: number | null = null
  ) => {
    updateUserCoursesMutation.mutate({ courseId, status, qualification });
  };

  const areCourseCorrelativesPassed = (course: Course) => {
    return (
      course.correlatives?.every((correlative) => {
        const progress = userProgress.find(
          (userCourse) => userCourse?.courseId === correlative.requiredCourse.id
        );

        return (
          progress?.status === "APROBADA" || progress?.status === "REGULARIZADA"
        );
      }) ?? true
    );
  };

  const getUnmetCorrelatives = (course: Course) => {
    const courseCorrelatives = course.correlatives;
    const unmetCorrelatives: CourseIdAndName[] = [];

    if (!courseCorrelatives || courseCorrelatives.length === 0) {
      return unmetCorrelatives;
    }

    for (const correlative of courseCorrelatives) {
      const requiredCourse = correlative.requiredCourse;
      const progress = userProgress.find(
        (userCourse) => userCourse?.courseId === requiredCourse.id
      );

      const isPassed =
        progress?.status === "APROBADA" || progress?.status === "REGULARIZADA";

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
  };

  return (
    <UserDataContext.Provider
      value={{
        userProgress,
        updateCourseStatus,
        areCourseCorrelativesPassed,
        getUnmetCorrelatives,
        isLoading: isLoadingCourses,
        isSaving: updateUserCoursesMutation.isPending,
      }}
    >
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
