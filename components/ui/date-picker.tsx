"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfMonth } from "date-fns"; // Added startOfMonth
import { es } from "date-fns/locale"; // Added Spanish locale
import { CalendarIcon } from "lucide-react";
// import { useForm } from "react-hook-form"; // Removed unused import
// import { z } from "zod"; // Removed unused import

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface DatePickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // TODO: Replace with correct form type
  name: string;
  label: string;
  description?: string;
}

export function DatePicker({ form, name, label, description }: DatePickerProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "MMMM yyyy", { locale: es }) // Changed format
                  ) : (
                    <span>Selecciona mes y año</span> // Changed placeholder
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(startOfMonth(date)); // Store first day of month
                  } else {
                    field.onChange(null);
                  }
                }}
                defaultMonth={field.value ? startOfMonth(field.value) : startOfMonth(new Date())}
                captionLayout="dropdown-buttons" // Added captionLayout
                fromYear={new Date().getFullYear() - 10} // Example: 10 years back
                toYear={new Date().getFullYear() + 10} // Example: 10 years forward
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
