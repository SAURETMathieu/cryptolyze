"use server";

import { supabase } from "@/src/lib/supabase/admin";
import { createEmailSchema } from "@/src/schemas/authSchemas";

import { validateSimpleSchema } from "./utils/validateSchema";

export async function canSendRecoverPasswordEmail(email: string) {
  const paramsValid = await validateSimpleSchema(createEmailSchema, email);
  if (!paramsValid.success) {
    return paramsValid;
  }

  let query = supabase.schema("admin").rpc("can_send_recover_password_email", {
    email_input: email,
  });

  const { data: isTrue, error } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: isTrue,
    message: "recovery_email_can_be_send",
  };
}

export async function canSendNewEmailEmail(profileId: string) {
  if (typeof profileId !== "string" || !profileId) {
    return {
      success: false,
      message: "Profile ID must be a non-empty string.",
      data: [],
    };
  }

  const { data: isTrue, error } = await supabase
    .schema("admin")
    .rpc("can_send_new_email_email", { p_profile_id: profileId });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: isTrue,
    message: "new_email_email_can_be_send",
  };
}

export async function canSendNewConfirmationEmail(email: string) {
  const paramsValid = await validateSimpleSchema(createEmailSchema, email);
  if (!paramsValid.success) {
    return paramsValid;
  }

  const { data: isTrue, error } = await supabase
    .schema("admin")
    .rpc("can_send_new_verification_email", { p_email: email });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: isTrue,
    message: "new_confirmation_email_can_be_send",
  };
}

export async function resetPasswordForEmail(email: string) {
  const paramsValid = await validateSimpleSchema(createEmailSchema, email);
  if (!paramsValid.success) {
    return paramsValid;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "reset_password_email_sent",
  };
}

// export async function resetPasswordForToken(token: string, password: string) {
//   const { error } = await supabase.auth.updateUser({ password });

//   if (error) {
//     return {
//       success: false,
//       message: error.message,
//       data: false,
//     };
//   }

//   revalidatePath("/reset-password");

//   return {
//     success: true,
//     message: "password_reset",
//     data: true,
//   };
// }
