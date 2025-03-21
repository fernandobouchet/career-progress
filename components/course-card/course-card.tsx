import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface Props {
  course: course;
}

const CourseCard = ({ course }: Props) => {
  return (
    <Card className="rounded-3xl h-full cursor-pointer p-4 text-sm">
      <CardHeader className="p-0">
        <CardTitle className="text-start">{course.name}</CardTitle>
      </CardHeader>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export { CourseCard };
