import { roleNameSchema } from "@/src/schemas/admin/roleSchemas";
import { z } from "zod";

export const generateNewRoleSchema = () => {
  return z.object({
    role: roleNameSchema,
  });
};

export const newRoleFormSchema = () => generateNewRoleSchema();

export const fieldConfig = () => ({
  role: {
    label: "Nom du rôle",
    description:
      "Le nom du rôle doit être unique et ne peut pas contenir d'espaces ou de caractères spéciaux. Les tirets (-), underscores (_) et points (.) sont autorisés. Et au maximum 63 caractères.",
  },
});
