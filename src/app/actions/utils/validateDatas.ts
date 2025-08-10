import { z } from "zod";

const idsSchema = z
  .array(z.union([z.string().uuid(), z.number().int().positive()]))
  .nonempty("ID(s) are required.");

const uuidSchema = z.string().uuid();

const integerIdSchema = z.preprocess(
  (val) => Number(val),
  z.number().int().positive()
);

export function validateIds(idsToCheck: unknown, withReturnData = false) {
  try {
    idsSchema.parse(idsToCheck);
    const response: { success: boolean; message: string; data?: any } = {
      success: true,
      message: "",
    };
    if (withReturnData) {
      response.data = null;
    }
    return response;
  } catch (error) {
    const response: { success: boolean; message: string; data?: any } = {
      success: false,
      message:
        "Invalid ID(s). Must be a non-empty array of strings or integers.",
    };
    if (withReturnData) {
      response.data = null;
    }
    return response;
  }
}

export function validateUuid(idToCheck: unknown) {
  try {
    uuidSchema.parse(idToCheck);
    return { success: true, message: "", data: null };
  } catch (error) {
    return {
      success: false,
      message: "Invalid string ID. Must be a non-empty string.",
      data: null,
    };
  }
}

export function validateIntegerId(idToCheck: unknown) {
  try {
    integerIdSchema.parse(idToCheck);
    return { success: true, message: "", data: null };
  } catch (error) {
    return {
      success: false,
      message: "Invalid integer ID. Must be a positive integer.",
      data: null,
    };
  }
}
