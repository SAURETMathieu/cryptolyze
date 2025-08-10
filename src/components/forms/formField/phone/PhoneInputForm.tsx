import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { PhoneInput } from "@/src/components/ui/phoneNumber";
import { cn } from "@/src/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import en from "react-phone-number-input/locale/en.json";
import fr from "react-phone-number-input/locale/fr.json";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface PhoneInputProps {
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

export function PhoneInputForm({
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
}: PhoneInputProps) {
  const tForms = useTranslations("Forms");
  const locale = useLocale();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("", containerClassName)}>
            <LabelSection label={label} required={required} />
            <FormControl>
              <PhoneInput
                international
                defaultCountry="FR"
                placeholder={placeholder || tForms("placeholder")}
                labels={locale === "fr" ? fr : en}
                disabled={isPending}
                className={cn(
                  "hover:ring-ring rounded-md hover:border-0 hover:ring-1",
                  className
                )}
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
}
