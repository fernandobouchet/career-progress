import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ProgressFormReturn } from "./course-card-form";

interface Props {
  form: ProgressFormReturn;
}

const MIN_YEAR = 2015;
const CURRENT_YEAR = new Date().getFullYear();

export const CourseCardFormDate = ({ form }: Props) => {
  if (form.watch("status") !== "APROBADA") return null;

  const approvedDate = form.watch("approvedDate");
  const selectedMonth = approvedDate
    ? (new Date(approvedDate).getMonth() + 1).toString()
    : "";
  const selectedYear = approvedDate
    ? new Date(approvedDate).getFullYear().toString()
    : "";

  return (
    <div className="flex flex-col items-center w-full mt-2">
      <label className="text-sm font-medium mb-1">Fecha de aprobación</label>
      <div className="flex gap-2">
        <Select
          value={selectedMonth}
          onValueChange={(value) => {
            const month = parseInt(value, 10);
            const year = approvedDate
              ? new Date(approvedDate).getFullYear()
              : CURRENT_YEAR;
            if (!isNaN(month) && !isNaN(year)) {
              form.setValue("approvedDate", new Date(year, month - 1, 1), {
                shouldDirty: true,
              });
            } else {
              form.setValue("approvedDate", null, { shouldDirty: true });
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(12)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedYear}
          onValueChange={(value) => {
            const year = parseInt(value, 10);
            const month = approvedDate
              ? new Date(approvedDate).getMonth() + 1
              : 1;
            if (!isNaN(month) && !isNaN(year)) {
              form.setValue("approvedDate", new Date(year, month - 1, 1), {
                shouldDirty: true,
              });
            } else {
              form.setValue("approvedDate", null, { shouldDirty: true });
            }
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: CURRENT_YEAR - MIN_YEAR + 1 },
              (_, i) => MIN_YEAR + i
            ).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {form.formState.errors.approvedDate && (
        <p className="text-sm text-red-500 text-center">
          {form.formState.errors.approvedDate.message?.toString()}
        </p>
      )}
    </div>
  );
};
