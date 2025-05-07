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
import { Session } from "next-auth";
import { useUserCourseCorrelatives } from "@/hooks/use-user-course-correlatives";
import { useUserCourseDeleteProgress } from "@/hooks/use-user-course-delete-progress";
import { useUserCourseUpdateProgress } from "@/hooks/use-user-course-update.progress";
import { useUserCourseOptional } from "@/hooks/use-user-course-optional";

type UserDataContextType = {
  userProgress: UserProgressStatus[];
  updateCourseStatus: (params: UpdateUserProgressStatus) => void;
  updateOptionalCourse: (params: UpdateOptionalCourse) => void;
  deleteCourseProgress: (courseId: number) => void;
  areCourseCorrelativesPassed: (course: Course) => boolean;
  getUnmetCorrelatives: (course: Course) => RequiredCourse[];
  isLoading: boolean;
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
  const { deleteCourseProgressMutation } = useUserCourseDeleteProgress({
    userProgress,
    setUserProgress,
  });
  const { updateUserCourseMutation } = useUserCourseUpdateProgress({
    userProgress,
    setUserProgress,
  });

  const { updateOptionalCoursesMutation } = useUserCourseOptional({
    userProgress,
    setUserProgress,
  });
  const { areCourseCorrelativesPassed, getUnmetCorrelatives } =
    useUserCourseCorrelatives(userProgress);

  const { data: initialUserCourses, isLoading: isLoadingCourses } =
    api.user.getCourseProgress.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!session,
    });

  useEffect(() => {
    if (Array.isArray(initialUserCourses)) {
      setUserProgress(initialUserCourses);
    }
  }, [initialUserCourses]);

  const updateCourseStatus = useCallback(
    ({ courseId, status, qualification }: UpdateUserProgressStatus) => {
      updateUserCourseMutation.mutate({
        courseId,
        status,
        qualification,
      });
    },
    [updateUserCourseMutation]
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

  const contextValue = useMemo(
    () => ({
      userProgress,
      updateCourseStatus,
      updateOptionalCourse,
      deleteCourseProgress,
      areCourseCorrelativesPassed,
      getUnmetCorrelatives,
      isLoading: isLoadingCourses,
    }),
    [
      userProgress,
      updateCourseStatus,
      updateOptionalCourse,
      deleteCourseProgress,
      areCourseCorrelativesPassed,
      getUnmetCorrelatives,
      isLoadingCourses,
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
