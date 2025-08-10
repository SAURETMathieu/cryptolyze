import { createPasswordSchema } from "@/src/schemas/authSchemas";
import { z } from "zod";

import {
  FormControlPassword,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { Icons } from "@/components/icons/icons";

export const generateResetPasswordFormSchema = (t: MessagesIntl) => {
  return z
    .object({
      newPassword: createPasswordSchema(t),
      newPasswordConfirm: createPasswordSchema(t),
    })
    .refine(
      ({ newPassword, newPasswordConfirm }) =>
        newPassword === newPasswordConfirm,
      {
        path: ["newPasswordConfirm"],
        message: t("passwordDidntMatch"),
      }
    );
};

export const resetPasswordFormSchema = (t: MessagesIntl) =>
  generateResetPasswordFormSchema(t);

export const fieldConfig = (t: MessagesIntl) => ({
  newPassword: {
    label: t("newPasswordLabel"),
    inputProps: {
      type: "password",
      placeholder: "●●●●●●●●",
    },
    fieldType: ({
      label,
      isRequired,
      field,
      fieldConfigItem,
      fieldProps,
      zodInputProps,
      zodItem,
    }: AutoFormInputComponentProps) => {
      const isLengthValid = field.value?.length >= 8;
      const hasUppercase = /(?=.*[A-Z])/.test(field.value ?? "");
      const hasLowercase = /(?=.*[a-z])/.test(field.value ?? "");
      const hasNumber = /(?=.*\d)/.test(field.value ?? "");
      const hasSpecialChar = /[$&+,:;=?@#|'<>.^*()%!-]/.test(field.value ?? "");

      return (
        <div>
          <FormItem>
            <FormLabel>
              {fieldConfigItem.label || label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>
            <FormControlPassword fieldPropsWithoutShowLabel={fieldProps} />
            <FormMessage />
          </FormItem>
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
                    {hasSpecialChar ? (
                      <Icons.validGreen />
                    ) : (
                      <Icons.validGrey />
                    )}
                  </span>
                  {t("signupPasswordFormatSpecial")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    },
  },
  newPasswordConfirm: {
    label: t("newPasswordConfirmLabel"),
    inputProps: {
      type: "password",
      placeholder: "●●●●●●●●",
    },
  },
});
