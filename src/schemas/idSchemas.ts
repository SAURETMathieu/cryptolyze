import { z } from "zod";

import { createNumberSchema } from "./utils";

export const generateNumberIdSchema = (t: MessagesIntl) =>
  z.object({
    id: createNumberSchema({
      dictionnary: t,
      min: 1,
      max: Infinity,
      invalidError: "invalid_params_id",
      requiredError: "required_params_id",
      minError: "min_params_id",
    }),
  });
