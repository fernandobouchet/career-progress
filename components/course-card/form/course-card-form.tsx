"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { CourseCardFormStatus } from "./course-card-form-status";
import { statusKeys } from "@/types/constants";
import { api } from "@/trpc/react";

const formSchema = z.object({
  status: z.enum(statusKeys),
  qualification: z.coerce
    .number()
    .min(4, { message: "La calificación debe ser superior o igual a 4." })
    .max(10, { message: "La calificación debe ser inferior o igual a 10." })
    .nullable(),
});

export type progressFormReturn = UseFormReturn<progressForm>;

interface Props {
  course: course;
}

const CourseCardForm = ({ course }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: course.progress?.status ? course.progress.status : "PENDIENTE",
      qualification: course?.progress ? course.progress.qualification : null,
    },
  });

  const mutation = api.user.updateCourseProgress.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      status: values.status,
      qualification: values.qualification,
      courseId: course.id,
    });

    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CourseCardFormStatus form={form} />
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calificación</FormLabel>
              <Select
                disabled={form.watch("status") !== "APROBADA"}
                onValueChange={field.onChange}
                defaultValue={
                  course.progress?.qualification
                    ? course.progress.qualification.toString()
                    : undefined
                }
              >
                <FormControl className="border-none bg-accent hover:bg-accent/80 [&>span]:mx-auto w-24">
                  <SelectTrigger>
                    <SelectValue placeholder={"-"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-none max-h-36 min-w-0">
                  {[4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <SelectItem
                      key={value}
                      value={value.toString()}
                      className="mx-auto text-center w-full"
                    >
                      {value.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export { CourseCardForm };
