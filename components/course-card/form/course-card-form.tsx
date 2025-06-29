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
import { CourseCardWarning } from "./course-card-warning";
import { CourseDeleteProgressWarning } from "./course-delete-progress-warning";
import { DatePicker } from "@/components/ui/date-picker"; // Added import

const formSchema = z
  .object({
    status: z.enum(statusKeys),
    qualification: z.coerce
      .number()
      .min(4, { message: "La calificación debe ser superior o igual a 4." })
      .max(10, { message: "La calificación debe ser inferior o igual a 10." })
      .nullable(),
    approvedDate: z.date().nullable(), // Added approvedDate field
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
  .refine(
    (data) => data.status !== "APROBADA" || data.approvedDate !== null, // Added refinement for approvedDate
    {
      message:
        "Debes indicar la fecha de aprobación cuando el estado de la materia es: 'Aprobada'.",
      path: ["approvedDate"],
    }
  );

export type ProgressForm = z.infer<typeof formSchema>; // Changed to ProgressForm
export type ProgressFormReturn = UseFormReturn<ProgressForm>;

interface Props {
  course: Course;
  handleOnClose: () => void;
}

const CourseCardForm = ({ course, handleOnClose }: Props) => {
  const { updateCourseStatus, areCourseCorrelativesPassed } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: course.progress?.status ? course.progress.status : "PENDIENTE",
      qualification: course?.progress ? course.progress.qualification : null,
      approvedDate: course?.progress?.approvedDate // Added approvedDate default value
        ? new Date(course.progress.approvedDate)
        : null,
    },
  });

  const status = form.watch("status"); // Watch status field

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateCourseStatus({
      courseId: course.id,
      placeholderCourseId: course.progress?.placeholderCourseId ?? null,
      status: values.status,
      qualification: values.qualification,
      approvedDate: values.approvedDate, // Added approvedDate to onSubmit
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
        className="h-full flex flex-col justify-between p-4"
      >
        <h3 className="font-medium">
          Modifica el estado y/o la calificación de la asignatura.
        </h3>
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex justify-evenly">
            <CourseCardFormStatus form={form} />
            <CourseCardFormQualification form={form} />
          </div>
          {status === "APROBADA" && ( // Conditionally render DatePicker
            <div className="mt-4">
              <DatePicker
                form={form}
                name="approvedDate"
                label="Fecha de aprobación"
              />
            </div>
          )}
        </div>
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
