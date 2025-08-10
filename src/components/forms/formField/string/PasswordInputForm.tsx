"use client";

import React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LabelSection } from "@/components/forms/layout/LabelSection";
import { Icons } from "@/components/icons/icons";

interface PasswordInputFormProps {
  form: any;
  label?: string;
  isRequired?: boolean;
  name: string;
  showValidations?: boolean;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PasswordInput = ({
  form,
  name,
  label,
  placeholder = "●●●●●●●●",
  required = false,
  isPending = false,
  className,
  containerClassName,
  disabled = false,
  readOnly = false,
  showValidations = false,
  autoComplete = "new-password",
}: PasswordInputFormProps) => {
  const password = form.watch(name);
  const isLengthValid = (password?.length ?? 0) >= 8;
  const hasUppercase = /(?=.*[A-Z])/.test(password ?? "");
  const hasLowercase = /(?=.*[a-z])/.test(password ?? "");
  const hasNumber = /(?=.*\d)/.test(password ?? "");
  const hasSpecialChar = /[$&+,:;=?@#|'<>.^*()%!-]/.test(password ?? "");
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const t = useTranslations("Forms");

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem className={cn("", containerClassName)}>
              <LabelSection label={label} required={required} />
              <Box className="relative">
                <Input
                  className={cn(
                    "border-primary/40 hover:ring-ring border pr-12 placeholder:text-xs hover:ring-1",
                    className
                  )}
                  placeholder={placeholder || t("placeholder")}
                  disabled={disabled || isPending}
                  readOnly={readOnly}
                  autoComplete={autoComplete}
                  type={passwordVisibility ? "text" : "password"}
                  data-testid={name}
                  {...field}
                  value={field.value ?? ""}
                />
                <Box
                  className="text-muted-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center p-3"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {React.createElement(
                    passwordVisibility ? EyeOffIcon : EyeIcon,
                    {
                      className: "size-6",
                    }
                  )}
                </Box>
              </Box>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {showValidations && (
        <div className="text-muted-foreground max-w-[400px] py-2 italic">
          <h3>{t("signupPasswordFormatTitle")}</h3>
          <div className="flex gap-2 pt-2">
            <ul className="flex w-1/2 flex-col">
              <li className="align-center flex">
                <span className="">
                  {isLengthValid ? <Icons.validGreen /> : <Icons.validGrey />}
                </span>
                {t("signupPasswordFormatCaracter")}
              </li>
              <li className="align-center flex">
                <span className="">
                  {hasNumber ? <Icons.validGreen /> : <Icons.validGrey />}
                </span>
                {t("signupPasswordFormatNumber")}
              </li>
              <li className="align-center flex">
                <span className="">
                  {hasUppercase ? <Icons.validGreen /> : <Icons.validGrey />}
                </span>
                {t("signupPasswordFormatUppercase")}
              </li>
            </ul>
            <ul className="flex w-1/2 flex-col">
              <li className="align-center flex">
                <span className="">
                  {hasLowercase ? <Icons.validGreen /> : <Icons.validGrey />}
                </span>
                {t("signupPasswordFormatLowercase")}
              </li>
              <li className="align-center flex">
                <span className="">
                  {hasSpecialChar ? <Icons.validGreen /> : <Icons.validGrey />}
                </span>
                {t("signupPasswordFormatSpecial")}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
