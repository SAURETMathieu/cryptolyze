"use server";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { ZodSchema } from "zod";

export async function validateSimpleSchemaWithLocale<T>(
  schemaFactory: (t: MessagesIntl, locale: "fr" | "en") => ZodSchema<T>,
  values: unknown,
  namespace: any = "Forms"
) {
  const locale = ((await cookies()).get("NEXT_LOCALE")?.value ?? "fr") as
    | "fr"
    | "en";

  const t = (await getTranslations({ locale, namespace })) as MessagesIntl;
  const schema = schemaFactory(t, locale);
  const validActionParams = schema.safeParse(values);

  if (!validActionParams.success) {
    const errorMessages = validActionParams.error.errors.map(
      (error) => error.message
    );
    return {
      success: false,
      message: errorMessages.join(", "),
      data: null,
    };
  }

  return {
    success: true,
    message: "",
    data: null,
  };
}

export async function validateSimpleSchema<T>(
  schemaFactory: (t: MessagesIntl) => ZodSchema<T>,
  values: unknown,
  namespace: any = "Forms"
) {
  const locale = ((await cookies()).get("NEXT_LOCALE")?.value ?? "fr") as
    | "fr"
    | "en";

  const t = (await getTranslations({ locale, namespace })) as MessagesIntl;
  const schema = schemaFactory(t);
  const validActionParams = schema.safeParse(values);

  if (!validActionParams.success) {
    const errorMessages = validActionParams.error.errors.map(
      (error) => error.message
    );
    return {
      success: false,
      message: errorMessages.join(", "),
      data: null,
    };
  }

  return {
    success: true,
    message: "",
    data: null,
  };
}

export async function validateSimpleSchemaWithoutTranslation<T>(
  schemaFactory: () => ZodSchema<T>,
  values: unknown
) {
  const schema = schemaFactory();
  const validActionParams = schema.safeParse(values);

  if (!validActionParams.success) {
    const errorMessages = validActionParams.error.errors.map(
      (error) => error.message
    );
    return {
      success: false,
      message: errorMessages.join(", "),
      data: null,
    };
  }

  return {
    success: true,
    message: "",
    data: null,
  };
}

// export async function validateComplexeSchema<T>(
//   schemaFactory: (
//     t: MessagesIntl,
//     locale: "fr" | "en",
//     variantsIds: number[],
//     vatPossibles: VatType[],
//     datas?: any
//   ) => ZodSchema<T>,
//   values: unknown,
//   namespace: any = "Forms",
//   params: any
// ) {
//   const locale = (cookies().get("NEXT_LOCALE")?.value ?? "fr") as "fr" | "en";

//   const t = (await getTranslations({ locale, namespace })) as MessagesIntl;
//   const schema = schemaFactory(t, locale, params.variantsIds, params.vatPossibles, params.datas);
//   const validActionParams = schema.safeParse(values);

//   if (!validActionParams.success) {
//     return {
//       success: false,
//       message: validActionParams.error.message,
//       data: null,
//     };
//   }

//   return {
//     success: true,
//     message: null,
//     data: null,
//   };
// }
