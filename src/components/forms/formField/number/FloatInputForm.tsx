import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { useTranslations } from "next-intl";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface FloatInputProps {
  form: any; // react-hook-form control
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  min?: number; // Minimum value allowed
  max?: number; // Maximum value allowed
}

const FloatInput = ({
  form,
  name,
  label,
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
  min = 0, // Default to 0 to always allow positive numbers unless otherwise specified
  max,
}: FloatInputProps) => {
  const tForms = useTranslations("Forms");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", containerClassName)}>
          {label && <LabelSection label={label} required={required} />}
          <FormControl>
            <Input
              type="number"
              step="any" // Allows floating-point numbers
              min={min} // Enforce minimum value (default to 0)
              max={max} // Enforce maximum value if provided
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

export default FloatInput;
