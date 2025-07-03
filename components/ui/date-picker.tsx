"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react"; // Added React import
import { format, startOfMonth, setYear, setMonth } from "date-fns"; // Added setYear, setMonth
import { es } from "date-fns/locale"; // Added Spanish locale
import { CalendarIcon } from "lucide-react";

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
  const [isOpen, setIsOpen] = React.useState(false);
  // Use a local state for the month to control the calendar view without immediately submitting
  // This is because onMonthChange triggers for both month and year dropdowns.
  // We only want to update the form field when the popover is closed or a specific action is taken.
  const [currentDisplayMonth, setCurrentDisplayMonth] = React.useState(
    form.getValues(name) ? startOfMonth(form.getValues(name)) : startOfMonth(new Date())
  );

  const handleMonthYearChange = (newDate: Date) => {
    const newMonthStart = startOfMonth(newDate);
    setCurrentDisplayMonth(newMonthStart);
    // Optionally, update the form immediately. Or wait for popover close.
    // For now, let's update immediately and close, which is a common UX for month/year pickers.
    form.setValue(name, newMonthStart, { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  onClick={() => setIsOpen(true)} // Manually trigger open
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
              {/* Apply a class to target with CSS to hide the day grid */}
              <Calendar
                className="month-year-picker"
                mode="single"
                selected={field.value ? startOfMonth(field.value) : undefined}
                month={currentDisplayMonth} // Controlled month
                onMonthChange={handleMonthYearChange} // Use onMonthChange
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear() - 70} // Adjusted year range
                toYear={new Date().getFullYear() + 5}   // Adjusted year range
                disabled={(date) => // Still disable future dates beyond the current month/year
                  startOfMonth(date) > startOfMonth(new Date()) || date < new Date("1900-01-01")
                }
                initialFocus={isOpen} // Focus when popover opens
                // onSelect is not strictly needed if onMonthChange handles the update and close
                // However, if a user *could* click a day, this ensures it sets correctly.
                onSelect={(date) => {
                    if (date) {
                        handleMonthYearChange(date);
                    } else {
                        field.onChange(null);
                        setIsOpen(false);
                    }
                }}
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
