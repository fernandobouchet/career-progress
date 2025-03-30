"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CourseCardContent } from "./course-card-content";

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseCardContentWrapper = ({ course, handleOnClose }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{course.name}</DrawerTitle>
        </DrawerHeader>
        <CourseCardContent course={course} />
        <DrawerFooter className="pt-2">
          <Button variant="outline" onClick={handleOnClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-xl h-3/5  flex flex-col rounded-3xl">
      <DialogHeader>
        <DialogTitle>{course.name}</DialogTitle>
      </DialogHeader>
      <CourseCardContent course={course} />
    </DialogContent>
  );
};

export { CourseCardContentWrapper };
