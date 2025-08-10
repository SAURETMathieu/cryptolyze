import { z } from "zod";

export const createStringSchema = (
  requiredError: string,
  data: any = undefined
) =>
  z
    .string({
      required_error: requiredError,
    })
    .min(1, requiredError)
    .default(data ?? "");
