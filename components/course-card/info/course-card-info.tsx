"use client";
import { Button } from "@/components/ui/button";
import { getFullArea } from "@/lib/functions";
import { Clock } from "lucide-react";
import { useState } from "react";

interface Props {
  course: Course;
}

const CourseCardInfo = ({ course }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div>
        <h3 className="font-medium">Área</h3>
        <p className="text-sm text-muted-foreground">
          {getFullArea(course.area)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Contenidos mínimos</h3>
        </div>
        <p
          className={`text-sm text-muted-foreground ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {course.info}
        </p>
        <Button
          variant="ghost"
          className="ml-auto cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Carga horaria</h3>
        <div className="flex justify-around gap-4">
          <div className="rounded-lg border p-3 flex flex-col items-center w-1/2">
            <div className="text-sm text-muted-foreground">
              Horas por semana
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{course.hsWeekly}</span>
            </div>
          </div>

          <div className="rounded-lg border p-3 flex flex-col items-center w-1/2">
            <div className="text-sm text-muted-foreground">Horas totales</div>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{course.hsTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CourseCardInfo };
