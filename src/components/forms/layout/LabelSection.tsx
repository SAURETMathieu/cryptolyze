"use client";

import { useTranslations } from "next-intl";

import { FormLabel } from "@/components/ui/form";

export function LabelSection({
  label,
  required,
  onlyLabel = false,
}: {
  label?: string | React.ReactNode;
  required?: boolean;
  onlyLabel?: boolean;
}) {
  const tForms = useTranslations("Forms");
  return (
    <FormLabel className="flex">
      {label}
      {required && !onlyLabel ? (
        <span className="text-destructive ml-1">*</span>
      ) : !required && !onlyLabel ? (
        <span className="text-muted-foreground ml-1">
          ({tForms("optional")})
        </span>
      ) : null}
    </FormLabel>
  );
}
