import { z } from "zod";

/**
 * Utility to parse a JSON string (e.g. '["A", "B"]') into a `z.array(schema)`
 * with fallback if parsing fails.
 *
 * @param schema - the Zod schema for the array elements
 * @returns a Zod schema with preprocessing
 */
export function parseJsonArrayOf<T extends z.ZodTypeAny>(
  schema: T
): z.ZodEffects<z.ZodTypeAny, z.infer<T>[], unknown> {
  return z.preprocess((val) => {
    if (val === null || val === undefined) return [];

    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
    return val;
  }, z.array(schema));
}
