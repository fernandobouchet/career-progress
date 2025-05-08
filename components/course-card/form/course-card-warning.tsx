import { Badge } from "@/components/ui/badge";
import { useUserData } from "@/context/user-data-context";

interface Props {
  course: Course;
}

const CourseCardWarning = ({ course }: Props) => {
  const { getCorrelativesStatus } = useUserData();

  const missingCorrelatives = getCorrelativesStatus(course).pending;
  return (
    <div className="flex flex-col gap-2 p-4 text-sm">
      <p>
        Aún debes aprobar / regularizar alguna de las siguientes materias para
        poder modificar el estado del curso:
      </p>
      <div className="flex flex-wrap gap-2 py-4">
        {missingCorrelatives?.map((correlative) => (
          <Badge
            key={correlative.requiredCourse.id}
            variant="outline"
            className={`rounded-full py-1 px-3 border-$`}
          >
            {correlative.requiredCourse.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export { CourseCardWarning };
