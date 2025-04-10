import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CourseCardForm } from "./form/course-card-form";
import { CourseCardInfo } from "./info/course-card-info";

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const tabsInfo = [
  { key: "info", title: "Información" },
  { key: "state", title: "Estado" },
  { key: "reviews", title: "Valoraciones" },
];

const CourseCardContent = ({ course, handleOnClose }: Props) => {
  console.log(course);
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-0">
      <Tabs defaultValue={tabsInfo[0].key} className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 rounded-3xl bg-sidebar h-14">
          {tabsInfo.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              className="rounded-3xl h-full text-base w-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:hover:bg-accent/90 hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="info">
          <ScrollArea className="overflow-y-auto h-full max-h-80">
            <CourseCardInfo course={course} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="state">
          <CourseCardForm course={course} handleOnClose={handleOnClose} />
        </TabsContent>
        <TabsContent value="comments">
          Comentarios / consejos sobre la materia.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { CourseCardContent };
