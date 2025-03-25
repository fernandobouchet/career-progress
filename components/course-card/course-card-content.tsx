import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  course: course;
}

const tabsInfo = [
  { key: "info", title: "Información" },
  { key: "state", title: "Estado" },
  { key: "comments", title: "Comentarios" },
];

const CourseCardContent = ({ course }: Props) => {
  return (
    <div className="w-full flex flex-col p-4 md:p-0">
      <Tabs defaultValue={tabsInfo[0].key}>
        <TabsList className="w-full rounded-3xl bg-sidebar h-14">
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
          <p className="text-sm">{course.info}</p>
        </TabsContent>
        <TabsContent value="state">Estado de la materia</TabsContent>
        <TabsContent value="comments">
          Comentarios / consejos sobre la materia.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { CourseCardContent };
