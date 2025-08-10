import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

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
