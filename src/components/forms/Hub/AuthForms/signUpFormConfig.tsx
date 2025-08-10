import {
  createAcceptTermsSchema,
  createBirthDateSchema,
  createEmailSchema,
  createFirstnameSchema,
  createLastnameSchema,
  createPasswordSchema,
} from "@/src/schemas/authSchemas";
import { z } from "zod";

export const generateSignUpFormSchema = (t: MessagesIntl) => {
  return z
    .object({
      firstname: createFirstnameSchema(t),
      lastname: createLastnameSchema(t),
      email: createEmailSchema(t),
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

export type SignUpFormSchemaType = z.infer<
  ReturnType<typeof generateSignUpFormSchema>
>;

export const signUpFormSchema = (t: MessagesIntl) =>
  generateSignUpFormSchema(t);
