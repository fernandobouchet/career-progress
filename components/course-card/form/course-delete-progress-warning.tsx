'use client";';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/user-data-context";

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseDeleteProgressWarning = ({ course, handleOnClose }: Props) => {
  const { deleteCourseProgress, userProgress } = useUserData();

  const dependentCoursesWithProgress =
    course.dependents?.filter((dependent) =>
      userProgress.some(
        (p) => p?.courseId === dependent.id && p.status !== "PENDIENTE"
      )
    ) || [];

  async function onDeleteProgress() {
    deleteCourseProgress(course.id);
    handleOnClose();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="cursor-pointer"
          disabled={!course.progress}
        >
          Eliminar
        </Button>
      </AlertDialogTrigger>
      {dependentCoursesWithProgress.length > 0 ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              No es posible eliminar el progreso
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta asignatura es requisito de otras que ya tienen progreso
              registrado. Para eliminar su progreso, primero eliminá el progreso
              de las siguientes materias:
            </AlertDialogDescription>
            <div>
              <ul className="list-disc pl-5 text-sm">
                {dependentCoursesWithProgress.map((e) => (
                  <li key={e.id} className="text-justify">
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              De acuerdo
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estas completamente seguro/a?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el progreso guardado de la asignatura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={onDeleteProgress}
              disabled={!course.progress}
            >
              Eliminar progreso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export { CourseDeleteProgressWarning };
