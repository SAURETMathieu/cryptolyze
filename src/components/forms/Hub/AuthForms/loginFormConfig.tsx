import {
  createEmailSchema,
  createPasswordSchema,
} from "@/src/schemas/authSchemas";
import { z } from "zod";

import NavigationLink from "@/components/link/NavigationLink";

export const generateLoginFormSchema = (t: MessagesIntl) => {
  return z.object({
    email: createEmailSchema(t),
    password: createPasswordSchema(t),
  });
};

export const fieldConfig = (t: MessagesIntl) => ({
  email: {
    label: t("emailLabel"),
    inputProps: {
      placeholder: "john.doe@email.com",
      autoComplete: "email",
    },
  },
  password: {
    label: t("passwordLabel"),
    description: (
      <NavigationLink
        href="/forgot-password"
        className="text-foreground hover:text-muted-foreground ml-auto block w-fit cursor-pointer underline"
      >
        {t("forgotPassword")}
      </NavigationLink>
    ),
    inputProps: {
      type: "password",
      placeholder: "●●●●●●●●",
    },
  },
});
