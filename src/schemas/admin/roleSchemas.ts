import { z } from "zod";

export const roleNameSchema = z
  .string()
  .trim()
  .min(1, {
    message:
      "Le nom du rôle ne peut pas être vide ou contenir uniquement des espaces",
  })
  .max(63, { message: "Le nom du rôle ne peut pas dépasser 63 caractères" })
  .regex(/^[a-zA-Z0-9_.-]+$/, {
    message:
      "Le nom du rôle peut contenir uniquement des lettres, chiffres, underscores (_), tirets (-) et points (.)",
  })
  .transform((val) => val.toLowerCase());
