import { z, ZodType } from "zod";

export const createArraySchema = <T>(
  schema: ZodType<T>,
  min: number = 0,
  max: number = 3,
  requiredError: string = "Field is required",
  defaultValue: T[] = []
) =>
  z
    .array(schema, {
      required_error: requiredError,
    })
    .min(min, { message: requiredError })
    .max(max, { message: requiredError })
    .default(defaultValue);
