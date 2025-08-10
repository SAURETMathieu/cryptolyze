import { getCountries, parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

// Zipcode regex
const zipCodeRegex = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i;

export const createAdressTitleNameSchema = (
  t: MessagesIntl,
  data: any = undefined
) =>
  z
    .string({
      required_error: t("addressTitleRequired"),
    })
    .max(100, t("addressTitleMaxLength"))
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, t("addressTitleInvalidFormat"))
    .default(data ?? undefined);

export const createCountrySchema = (
  t: MessagesIntl,
  locale: string,
  data: any = undefined
) => {
  const countries = getCountries();
  return z
    .enum(countries as [string, ...string[]], {
      required_error: t("countryRequired"),
    })
    .refine((val) => val !== undefined, {
      message: t("countryRequired"),
    })
    .default(data ?? "FR");
};

export const createCitySchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("cityRequired"),
    })
    .max(100, t("cityMaxLength"))
    .regex(/^[^\d0-9]+$/, t("cityInvalidFormat"))
    .default(data ?? undefined);

export const createZipCodeSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("zipcodeRequired"),
    })
    .regex(zipCodeRegex, t("zipcodeInvalidFormat"))
    .default(data ?? undefined);

export const createAddressSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("addressRequired"),
    })
    .min(5, { message: t("addressTooShort") })
    .max(255, { message: t("addressMaxLength") })
    .default(data ?? undefined);

export const createComplementAddressSchema = (
  t: MessagesIntl,
  data: any = undefined
) =>
  z
    .string()
    .max(255, { message: t("complementAddressMaxLength") })
    .optional()
    .nullable()
    .default(data?.trim() === "" ? undefined : (data ?? undefined));

// phone number should be without spaces, cause of the libphonenumber-js library
export const createPhoneSchema = (t: MessagesIntl, data: any = undefined) =>
  z
    .string({
      required_error: t("phoneRequired"),
    })
    .refine(
      (val) => {
        const phoneNumber = parsePhoneNumberFromString(val);
        return phoneNumber?.isValid();
      },
      {
        message: t("phoneInvalidFormat"),
      }
    )
    .default(data ?? undefined);

export const createPhoneSchemaWithoutParsing = (
  t: MessagesIntl,
  data: any = undefined
) =>
  z
    .string({
      required_error: t("phoneRequired"),
    })
    .regex(/^[+]?[0-9][0-9\s]*$/, {
      message: t("phoneInvalidFormat"),
    })
    .transform((val) => val.replace(/\s/g, ""))
    .default(data ?? undefined);
