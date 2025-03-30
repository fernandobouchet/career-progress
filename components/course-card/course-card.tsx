import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { CourseStatusBadge } from "./course-status-badge";

interface Props {
  course: Course;
}

const CourseCard = ({ course }: Props) => {
  return (
    <Card className="rounded-3xl flex flex-col justify-between h-full cursor-pointer p-4 text-sm border-none">
      <CardHeader className="p-0">
        <CardTitle className="text-start">{course.name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-0">
        <CourseStatusBadge
          className="ml-auto"
          status={course.progress?.status}
        />
      </CardFooter>
    </Card>
  );
};

export { CourseCard };
