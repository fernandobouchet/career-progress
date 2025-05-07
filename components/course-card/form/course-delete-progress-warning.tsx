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
  const { deleteCourseProgress } = useUserData();

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
          Eliminar progreso
        </Button>
      </AlertDialogTrigger>
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
    </AlertDialog>
  );
};

export { CourseDeleteProgressWarning };
