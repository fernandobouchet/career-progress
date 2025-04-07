import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProgressFormReturn } from "./course-card-form";

interface Props {
  form: ProgressFormReturn;
}

const CourseCardFormStatus = ({ form }: Props) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado actual de la materia." />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-none">
              <SelectItem value="CURSANDO">Cursando</SelectItem>
              <SelectItem value="APROBADA">Aprobada</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="REGULARIZADA">Regularizada</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export { CourseCardFormStatus };
