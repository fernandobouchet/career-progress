"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CourseCardFormStatus } from "./course-card-form-status";
import { statusKeys } from "@/types/constants";
import { useUserData } from "@/context/user-data-context";
import { CourseCardFormQualification } from "./course-card-form-qualification";

const formSchema = z.object({
  status: z.enum(statusKeys),
  qualification: z.coerce
    .number()
    .min(4, { message: "La calificación debe ser superior o igual a 4." })
    .max(10, { message: "La calificación debe ser inferior o igual a 10." })
    .nullable(),
});

export type ProgressFormReturn = UseFormReturn<ProgressForm>;

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseCardForm = ({ course, handleOnClose }: Props) => {
  const { updateCourseStatus } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: course.progress?.status ? course.progress.status : "PENDIENTE",
      qualification: course?.progress ? course.progress.qualification : null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateCourseStatus(course.id, values.status, values.qualification);
    handleOnClose();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between p-4 h-full"
      >
        <p>Modifica el estado y/o la calificación de la materia.</p>
        <div className="w-full flex justify-evenly">
          <CourseCardFormStatus form={form} />
          <CourseCardFormQualification form={form} />
        </div>
        <Button className="ml-auto" type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  );
};

export { CourseCardForm };
