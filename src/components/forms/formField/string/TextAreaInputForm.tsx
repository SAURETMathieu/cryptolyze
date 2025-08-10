"use client";

import { LabelSection } from "@/src/components/forms/layout/LabelSection";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";

interface TextAreaInputProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
}

const TextAreaInput = ({
  form,
  name,
  label,
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
}: TextAreaInputProps) => {
  const tForms = useTranslations("Forms");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", containerClassName)}>
          <LabelSection label={label} required={required} />
          <FormControl>
            <Textarea
              placeholder={placeholder || tForms("placeholder")}
              disabled={isPending}
              className={(cn("hover:ring-ring border hover:ring-1"), className)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaInput;
