import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CourseCardForm } from "./form/course-card-form";
import { CourseCardInfo } from "./info/course-card-info";
import { CourseOptativeForm } from "./optative-form/course-optative-form";

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const tabsInfo = [
  { key: "info", title: "Información" },
  { key: "state", title: "Estado" },
  /*{ key: "reviews", title: "Valoraciones" },*/
];

const CourseCardContent = ({ course, handleOnClose }: Props) => {
  return (
    <div className="w-full h-full flex flex-col p-2 md:p-0">
      <Tabs
        defaultValue={tabsInfo[0].key}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-3xl bg-sidebar h-12 md:h-14 flex-shrink-0">
          {tabsInfo.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              className="rounded-3xl h-full text-base w-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:hover:bg-accent/90 hover:bg-muted hover:text-foreground cursor-pointer"
              disabled={
                course.isPlaceholder && !course.progress?.placeholderCourseId
              }
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="info" className="h-full">
            {course.isPlaceholder && !course.progress?.placeholderCourseId ? (
              <CourseOptativeForm course={course} />
            ) : (
              <ScrollArea
                type="scroll"
                className="h-full md:max-h-80 py-2 px-4"
              >
                <CourseCardInfo course={course} />
              </ScrollArea>
            )}
          </TabsContent>
          <TabsContent value="state" className="h-full py-2 px-4">
            <CourseCardForm course={course} handleOnClose={handleOnClose} />
          </TabsContent>
        </div>
        {/*
        <TabsContent value="comments">
          Comentarios / consejos sobre la materia.
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export { CourseCardContent };
