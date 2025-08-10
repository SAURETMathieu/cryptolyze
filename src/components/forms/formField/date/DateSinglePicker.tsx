"use client";

import * as DatePickerPrimitive from "@/src/components/ui/date-picker-primitive";
import { enGB as en, fr } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
  DatePickerValue,
} from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LabelSection } from "@/components/forms/layout/LabelSection";

export default function DateSinglePicker({
  form,
  isPending,
  name,
  label,
  required = true,
  numberOfMonths = 1,
  locale = "fr",
  disabledDates,
  onSelect,
  fromYear = new Date().getFullYear(),
  toYear = new Date().getFullYear() + 5,
  disabled = false,
}: {
  form: any;
  isPending: boolean;
  name: string;
  label?: string;
  required?: boolean;
  numberOfMonths?: number;
  locale?: "en" | "fr";
  disabledDates?: (date: Date) => boolean;
  onSelect?: (date: Date | undefined) => void;
  fromYear?: number;
  toYear?: number;
  disabled?: boolean;
}) {
  const localeToUse = locale === "fr" ? fr : en;
  const dateFormat = locale === "fr" ? "dd/MM/yyyy" : "MM/dd/yyyy";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <LabelSection label={label} required={required} />
          <DatePicker
            mode="single"
            value={field.value as Date}
            onValueChange={field.onChange}
            disabled={disabled || isPending}
            formatStr={dateFormat}
          >
            <FormControl>
              <DatePickerInput className="flex-1" locale={locale}>
                <DatePickerValue />
              </DatePickerInput>
            </FormControl>
            <DatePickerContent>
              <DatePickerPrimitive.Calendar asChild>
                <Calendar
                  mode="single"
                  locale={localeToUse}
                  captionLayout="dropdown-buttons"
                  fromYear={fromYear}
                  toYear={toYear}
                  numberOfMonths={numberOfMonths}
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(value) => {
                    field.onChange(value);
                    if (onSelect) onSelect(value);
                  }}
                  disabled={
                    disabledDates
                      ? disabledDates
                      : (date) =>
                          date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
              </DatePickerPrimitive.Calendar>
            </DatePickerContent>
          </DatePicker>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
