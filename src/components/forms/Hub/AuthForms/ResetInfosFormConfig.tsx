import {
  createAcceptTermsSchema,
  createBirthDateSchema,
  createFirstnameSchema,
  createLastnameSchema,
  createPasswordSchema,
} from "@/src/schemas/authSchemas";
import { z } from "zod";

export const generateResetInfosFormSchema = (t: MessagesIntl, data: any) => {
  return z
    .object({
      firstname: createFirstnameSchema(t, data?.first_name),
      lastname: createLastnameSchema(t, data?.last_name),
      birthdate: createBirthDateSchema(t),
      password: createPasswordSchema(t),
      passwordConfirm: createPasswordSchema(t),
      accept: createAcceptTermsSchema(t),
    })
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
      path: ["passwordConfirm"],
      message: t("passwordDidntMatch"),
    });
};

export type ResetInfosFormSchemaType = z.infer<
  ReturnType<typeof generateResetInfosFormSchema>
>;
