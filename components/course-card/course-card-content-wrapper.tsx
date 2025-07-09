"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CourseCardContent } from "./course-card-content";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseCardContentWrapper = ({ course, handleOnClose }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerDescription />
        <DrawerHeader className="text-left py-3 flex-shrink-0">
          <DrawerTitle>{course.name}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <CourseCardContent course={course} handleOnClose={handleOnClose} />
        </div>
        <DrawerFooter className="pt-2 flex-shrink-0">
          <Button variant="outline" onClick={handleOnClose}>
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-2xl h-[30rem] flex flex-col rounded-3xl">
      <DialogDescription />
      <DialogHeader>
        <DialogTitle>{course.name}</DialogTitle>
      </DialogHeader>
      <CourseCardContent course={course} handleOnClose={handleOnClose} />
    </DialogContent>
  );
};

export { CourseCardContentWrapper };
