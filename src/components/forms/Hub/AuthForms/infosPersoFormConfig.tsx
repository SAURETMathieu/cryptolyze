import {
  createEmailSchema,
  createFirstnameSchema,
  createLastnameSchema,
} from "@/src/schemas/authSchemas";
import { z } from "zod";

export const generateInfosPersoFormSchema = (t: MessagesIntl, profile: any) => {
  return z.object({
    firstname: createFirstnameSchema(t, profile.first_name),
    lastname: createLastnameSchema(t, profile.last_name),
    email: createEmailSchema(t, profile.email),
  });
};

export const infosPersoFormSchema = (t: MessagesIntl, profile: any) =>
  generateInfosPersoFormSchema(t, profile);

export const fieldConfig = (t: MessagesIntl) => ({
  firstname: {
    label: t("firstnameLabel"),
    inputProps: {
      placeholder: "John",
      disabled: true,
    },
  },
  lastname: {
    label: t("lastnameLabel"),
    inputProps: {
      placeholder: "Doe",
      disabled: true,
    },
  },
  email: {
    label: t("emailLabel"),
    inputProps: {
      placeholder: "john.doe@email.com",
      autoComplete: "email",
      disabled: true,
    },
  },
});
