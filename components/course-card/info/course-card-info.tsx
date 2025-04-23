"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFullArea } from "@/lib/functions";
import { ArrowRight, BookmarkIcon, Clock, FileText } from "lucide-react";
import { useState } from "react";

interface Props {
  course: Course;
}

const CourseCardInfo = ({ course }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm">Área</h3>
        </div>
        <Badge>{getFullArea(course.area)}</Badge>
      </div>
      <div className="flex flex-col py-2 gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm">Contenidos mínimos</h3>
        </div>

        <div
          className={`text-sm text-muted-foreground transition-all duration-300 ease-in-out ${
            expanded ? "max-h-96" : "max-h-12"
          } overflow-hidden`}
        >
          <p className={!expanded ? "line-clamp-2" : ""}>{course.info}</p>
        </div>

        <Button
          variant="ghost"
          className="ml-auto cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </Button>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm">Carga horaria</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-full py-1 px-3">
            {course.hsWeekly} hs/semana
          </Badge>
          <Badge>{course.hsTotal} totales</Badge>
        </div>
      </div>
      {course.correlatives && course.correlatives.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Correlativas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.correlatives.map((correlative) => (
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
      )}
    </div>
  );
};

export { CourseCardInfo };
