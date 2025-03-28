import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { progressFormReturn } from "./course-card-form";

interface Props {
  form: progressFormReturn;
}

const CourseCardFormQualification = ({ form }: Props) => {
  return (
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
              typeof field.value !== "number" ? "-" : field.value.toString()
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
  );
};

export { CourseCardFormQualification };
