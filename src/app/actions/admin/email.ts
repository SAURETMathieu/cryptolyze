"use server";

import {
  EmailConfigSchemaType,
  generateEmailConfigSchema,
} from "@/src/components/pages/Admin/Emails/emailConfigFormConfig";
import { createServer } from "@/src/lib/supabase/server";

import { validateIntegerId } from "../utils/validateDatas";
import { validateSimpleSchema } from "../utils/validateSchema";

export async function insertEmailConfig(values: EmailConfigSchemaType) {
  const validParams = await validateSimpleSchema(
    generateEmailConfigSchema,
    values
  );

  if (!validParams.success) {
    return validParams;
  }

  const supabase = createServer();

  let query = supabase.from("email_config").insert(values).select("*").single();

  const { error, data: emailConfig } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Email config created",
    data: emailConfig,
  };
}

export async function updateEmailConfig(
  values: EmailConfigSchemaType,
  id: number
) {
  const validParams = await validateSimpleSchema(
    generateEmailConfigSchema,
    values
  );

  if (!validParams.success) {
    return validParams;
  }
  const { success: idSuccess } = validateIntegerId(id);
  if (!idSuccess) {
    return {
      success: false,
      message: "Invalid integer ID. Must be a positive integer.",
      data: null,
    };
  }

  const supabase = createServer();

  let query = supabase
    .from("email_config")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();

  const { error, data: emailConfig } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Email config updated",
    data: emailConfig,
  };
}

export async function toggleEmailConfigStatus(status: boolean, id: number) {
  if (status !== false && status !== true) {
    return {
      success: false,
      message: "Invalid status. Must be a boolean.",
      data: null,
    };
  }
  const { success: idSuccess } = validateIntegerId(id);
  if (!idSuccess) {
    return {
      success: false,
      message: "Invalid integer ID. Must be a positive integer.",
      data: null,
    };
  }

  const supabase = createServer();
  const { error, data: updatedEmailConfig } = await supabase
    .from("email_config")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Email config status updated",
    data: updatedEmailConfig,
  };
}
