"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface Props {
  course: course;
  handleOnClose: () => void;
}

const CourseCardContent = ({ course, handleOnClose }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{course.name}</DrawerTitle>
          <DrawerDescription>{course.info} </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Button variant="outline" onClick={handleOnClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-xl rounded-3xl">
      <DialogHeader>
        <DialogTitle>{course.name}</DialogTitle>
        <DialogDescription>{course.info}</DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export { CourseCardContent };
