"use client";

import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import { CourseCard } from "./course-card";
import { CourseCardContentWrapper } from "./course-card-content-wrapper";

interface Props {
  course: Course;
}

const CourseCardTrigger = ({ course }: Props) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleOnClose = () => {
    setOpen(!open);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <CourseCard course={course} />
        </DrawerTrigger>
        <CourseCardContentWrapper
          course={course}
          handleOnClose={handleOnClose}
        />
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <CourseCard course={course} />
      </DialogTrigger>
      <CourseCardContentWrapper course={course} handleOnClose={handleOnClose} />
    </Dialog>
  );
};

export { CourseCardTrigger };
