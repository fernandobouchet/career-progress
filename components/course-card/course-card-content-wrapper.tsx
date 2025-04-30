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
      <DrawerContent className="min-h-10/12">
        <DrawerDescription />
        <DrawerHeader className="text-left py-3">
          <DrawerTitle>{course.name}</DrawerTitle>
        </DrawerHeader>
        <CourseCardContent course={course} handleOnClose={handleOnClose} />
        <DrawerFooter className="pt-2">
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
