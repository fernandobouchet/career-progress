"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, Resolver } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CourseCardFormStatus } from "./course-card-form-status";
import { useUserData } from "@/context/user-data-context";
import { CourseCardFormQualification } from "./course-card-form-qualification";
import { CourseCardWarning } from "./course-card-warning";
import { CourseDeleteProgressWarning } from "./course-delete-progress-warning";
import { CourseCardFormDate } from "./course-card-form-date";
import { statusKeys } from "@/types/constants";

const MIN_YEAR = 2015;

const formSchema = z
  .object({
    status: z.enum(statusKeys),
    qualification: z.coerce
      .number()
      .min(4, { message: "La calificación debe ser superior o igual a 4." })
      .max(10, { message: "La calificación debe ser inferior o igual a 10." })
      .nullable(),
    approvedDate: z.date().nullable(),
  })
  .refine(
    (data) =>
      data.status !== "APROBADA" ||
      (data.qualification !== null && !isNaN(data.qualification)),
    {
      message:
        "Debes indicar la calificación cuando el estado de la materia es: 'Aprobada'.",
      path: ["qualification"],
    }
  )
  .refine((data) => data.status !== "APROBADA" || data.approvedDate !== null, {
    message:
      "Debes indicar la fecha de aprobación cuando el estado es 'Aprobada'.",
    path: ["approvedDate"],
  })
  .refine(
    (data) =>
      data.approvedDate === null || data.approvedDate.getFullYear() >= MIN_YEAR,
    `El año debe ser mayor o igual a ${MIN_YEAR}.`
  );

export type ProgressFormReturn = UseFormReturn<ProgressForm>;

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseCardForm = ({ course, handleOnClose }: Props) => {
  const { updateCourseStatus, areCourseCorrelativesPassed } = useUserData();

  const form = useForm<ProgressForm>({
    mode: "onChange",
    resolver: zodResolver(formSchema) as Resolver<ProgressForm>,
    defaultValues: {
      status: course.progress?.status
        ? (course.progress.status as ProgressForm["status"])
        : "PENDIENTE",
      qualification: course?.progress ? course.progress.qualification : null,
      approvedDate:
        course?.progress &&
        course.progress.status === "APROBADA" &&
        course.progress.approvedDate
          ? new Date(course.progress.approvedDate)
          : null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateCourseStatus({
      courseId: course.id,
      placeholderCourseId: course.progress?.placeholderCourseId ?? null,
      status: values.status,
      qualification: values.qualification,
      approvedDate: values.status === "APROBADA" ? values.approvedDate : null,
    });
    handleOnClose();
  }

  if (!areCourseCorrelativesPassed(course)) {
    return <CourseCardWarning course={course} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col justify-between"
      >
        <h3 className="text-sm">
          Modifica el estado y/o la calificación de la asignatura.
        </h3>
        <div className="w-full flex justify-evenly">
          <CourseCardFormStatus form={form} />
          <CourseCardFormQualification form={form} />
        </div>
        <CourseCardFormDate form={form} />
        {form.formState.errors.status && (
          <p className="text-sm text-red-500 text-center">
            {form.formState.errors.status.message?.toString()}
          </p>
        )}

        {form.formState.errors.qualification && (
          <p className="text-sm text-red-500 text-center">
            {form.formState.errors.qualification.message?.toString()}
          </p>
        )}

        <div className="flex justify-between items-center">
          <CourseDeleteProgressWarning
            course={course}
            handleOnClose={handleOnClose}
          />
          <Button
            className="ml-auto cursor-pointer"
            type="submit"
            disabled={!form.formState.isDirty}
          >
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CourseCardForm };
