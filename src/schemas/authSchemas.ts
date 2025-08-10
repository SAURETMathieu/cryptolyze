import { emailRegex } from "@/src/regex/";
import { isAfter, isValid, subYears } from "date-fns";
import { z } from "zod";

export const createEmailSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("emailRequired"),
    })
    .max(320, t("emailMaxLength"))
    .regex(emailRegex, t("emailInvalidFormat"))
    .default(data);

export const createBirthDateSchema = (t: MessagesIntl) =>
  z
    .date({
      required_error: t("birthdateRequired"),
      invalid_type_error: t("birthdateInvalidDate"),
    })
    .refine(
      (date) => {
        return isValid(date);
      },
      {
        message: t("birthdateInvalidDate"),
      }
    )
    .refine((date) => !isAfter(date, subYears(new Date(), 18)), {
      message: t("birthdateUnderage"),
    })
    .refine((date) => isAfter(date, subYears(new Date(), 100)), {
      message: t("birthdateInvalidDate"),
    });

export const createPasswordSchema = (t: MessagesIntl) =>
  z
    .string({
      required_error: t("passwordRequired"),
    })
    .min(8, {
      message: t("passwordMinLength"),
    })
    .regex(/(?=.*[A-Z])/, {
      message: t("passwordUppercase"),
    })
    .regex(/(?=.*[a-z])/, {
      message: t("passwordLowercase"),
    })
    .regex(/(?=.*\d)/, {
      message: t("passwordDigit"),
    })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
      message: t("passwordSpecialChar"),
    });

export const createFirstnameSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("firstnameRequired"),
    })
    .min(2, { message: t("firstnameTooShort") })
    .max(50, { message: t("firstnameMaxLength") })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, {
      message: t("firstnameInvalid"),
    })
    .default(data);

export const createLastnameSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("lastnameRequired"),
    })
    .min(2, { message: t("lastnameTooShort") })
    .max(50, { message: t("lastnameMaxLength") })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, {
      message: t("lastnameInvalid"),
    })
    .default(data);

export const createAcceptTermsSchema = (t: MessagesIntl) =>
  z
    .boolean({ required_error: t("acceptTermsRequired") })
    .refine((value) => value, {
      message: t("acceptTermsRequired"),
    });
