import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCardTrigger } from "./course-card/course-card-trigger";

interface Props {
  periods: period[];
}

const PeriodsTabs = ({ periods }: Props) => {
  console.log(periods);
  return (
    <Tabs defaultValue="1" className="w-full flex items-center">
      <TabsList className="flex w-full p-0 h-14 border-none rounded-3xl bg-sidebar">
        {periods.map((period) => (
          <TabsTrigger
            key={period.id}
            value={period.order.toString()}
            className="rounded-3xl h-full text-base w-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:hover:bg-accent/90 hover:bg-muted hover:text-foreground cursor-pointer"
          >
            {period.order}
          </TabsTrigger>
        ))}
      </TabsList>
      {periods.map((period) => (
        <TabsContent
          key={period.id}
          value={period.order.toString()}
          className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5"
        >
          {period.courses?.map((course) => {
            return <CourseCardTrigger key={course.id} course={course} />;
          })}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export { PeriodsTabs };
