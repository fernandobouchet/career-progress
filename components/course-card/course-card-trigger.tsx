"use client";

import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import { CourseCard } from "./course-card";
import { CourseCardContent } from "./course-card-content";

interface Props {
  course: course;
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
        <CourseCardContent course={course} handleOnClose={handleOnClose} />
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <CourseCard course={course} />
      </DialogTrigger>
      <CourseCardContent course={course} handleOnClose={handleOnClose} />
    </Dialog>
  );
};

export { CourseCardTrigger };
