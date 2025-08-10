import { createNumberSchema, createStringSchema } from "@/src/schemas/utils";
import { z } from "zod";

export const generateGetReferencesQuerySchema = (t: MessagesIntl) =>
  z.object({
    page: createNumberSchema({
      dictionnary: t,
      invalidError: "invalid_params_page",
      min: 1,
      minError: "min_params_page",
      defaultValue: 1,
      required: false,
    }),
    search: createStringSchema({
      dictionnary: t,
      defaultValue: "",
      required: false,
    }),
    brand: createStringSchema({
      dictionnary: t,
      defaultValue: "",
      required: false,
    }),
    limit: createNumberSchema({
      dictionnary: t,
      min: 1,
      minError: "min_params_limit",
      max: 100,
      maxError: "max_params_limit",
      defaultValue: 40,
      required: false,
    }),
  });
