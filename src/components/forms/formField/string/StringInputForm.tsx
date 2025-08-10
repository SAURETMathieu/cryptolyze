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

interface StringInputProps {
  form: any; // react-hook-form control
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  readOnly?: boolean;
  autoComplete?: string;
}

const StringInput = ({
  form,
  name,
  label,
  placeholder,
  required = false,
  isPending = false,
  className,
  containerClassName,
  readOnly = false,
  autoComplete = "off",
}: StringInputProps) => {
  const tForms = useTranslations("Forms");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("", containerClassName)}>
            <LabelSection label={label} required={required} />
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder || tForms("placeholder")}
                disabled={isPending}
                className={cn("hover:ring-ring border hover:ring-1", className)}
                readOnly={readOnly}
                autoComplete={autoComplete}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default StringInput;
