"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
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
} from "@/components/ui/select";
import { useUserData } from "@/context/user-data-context";

interface Props {
  course: Course;
}

const FormSchema = z.object({
  optativeId: z.coerce.number({
    message: "Por favor selecciona una de las opciones.",
  }),
});

const CourseOptativeForm = ({ course }: Props) => {
  const { updateOptionalCourse } = useUserData();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema) as Resolver<z.infer<typeof FormSchema>>,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateOptionalCourse({
      courseId: course.id,
      placeholderCourseId: data.optativeId,
    });
  }

  return (
    <div className="w-full h-full flex flex-col items-center py-2 px-4 md:p-0 gap-4">
      <h2>Elección de la asignatura</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-4"
        >
          <FormField
            control={form.control}
            name="optativeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecciona una de las siguientes opciones</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-64 md:w-80 cursor-pointer">
                      <SelectValue placeholder="Selecciona la materia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-64 md:w-80">
                    {course.optatives?.map((optative) => (
                      <SelectItem
                        key={optative.optionCourse.id}
                        value={optative.optionCourse.id.toString()}
                        className="cursor-pointer"
                      >
                        {optative.optionCourse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cursor-pointer">
            Confirmar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export { CourseOptativeForm };
