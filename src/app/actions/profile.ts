"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase as supabaseAdmin } from "@/src/lib/supabase/admin";
import { createServer } from "@/src/lib/supabase/server";
import {
  createEmailSchema,
  createPasswordSchema,
} from "@/src/schemas/authSchemas";
import { z } from "zod";

import {
  ResetPasswordFormType,
  UpdatePasswordFormType,
} from "@/types/returnType";

import { validateUuid } from "./utils/validateDatas";
import { validateSimpleSchema } from "./utils/validateSchema";

const updatePasswordFormSchemaAction = (t: MessagesIntl) => {
  return z.object({
    password: createPasswordSchema(t),
    newPassword: createPasswordSchema(t),
    newPasswordConfirm: createPasswordSchema(t),
  });
};

const resetPasswordFormSchemaAction = (t: MessagesIntl) => {
  return z.object({
    newPassword: createPasswordSchema(t),
    newPasswordConfirm: createPasswordSchema(t),
  });
};

export async function updateProfileType(type: "Perso" | "Pro") {
  if (type !== "Perso" && type !== "Pro") {
    return {
      success: false,
      message: "Invalid type",
      data: null,
    };
  }
  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login`);
  }

  const { error, data: profile } = await supabaseAdmin
    .from("profiles")
    .update({ type })
    .eq("id", user?.id)
    .select("*");

  if (error || !profile) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
  return {
    success: true,
    message: "Profile updated successfully",
    data: profile,
  };
}

export const updatePassword = async (values: UpdatePasswordFormType) => {
  const paramsValid = await validateSimpleSchema(
    updatePasswordFormSchemaAction,
    values
  );
  if (!paramsValid.success) {
    return {
      success: paramsValid.success,
      message: paramsValid.message,
    };
  }

  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "user_not_authenticated",
    };
  }

  const { data: response } = await supabase.rpc(
    "confirm_current_user_password",
    { current_plain_password: values.password }
  );

  //@ts-ignore
  if (!response.data) {
    return {
      success: false,
      message: "current_password_incorrect",
    };
  }

  if (values.newPassword !== values.newPasswordConfirm) {
    return {
      success: false,
      message: "passwords_not_matching",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: values.newPassword,
  });

  if (error) {
    return {
      success: false,
      message: error.code ?? error.message,
    };
  }

  return {
    success: true,
    message: "Le mot de passe a bien été modifié.",
  };
};

export const updateVerifyStatus = async (bool: boolean = true) => {
  if (typeof bool !== "boolean") {
    return {
      success: false,
      message: "Invalid boolean value",
      data: null,
    };
  }

  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  let query = supabaseAdmin
    .from("profiles")
    .update({ is_verified: bool })
    .eq("id", user?.id)
    .is("is_verified", null)
    .select("*")
    .single();

  const { data: profile, error } = await query;

  if (error) {
    return {
      success: false,
      message: error.code ?? error.message,
      data: profile,
    };
  }

  return {
    success: true,
    message: "account_verified",
    data: profile,
  };
};

export const updateSumSubId = async (applicantId: string) => {
  if (!applicantId && typeof applicantId !== "string") {
    return {
      success: false,
      message: "Invalid sumsub id",
      data: null,
    };
  }
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  if (profile?.sumsub_id) {
    return {
      success: true,
      message: "sumsub_id_already_exists",
      data: profile,
    };
  }
  let query = supabaseAdmin
    .from("profiles")
    .update({ sumsub_id: applicantId })
    .eq("id", user?.id)
    .select("*")
    .single();

  const { data: profileUpdated, error } = await query;

  if (error) {
    return {
      success: false,
      message: error.code ?? error.message,
      data: profileUpdated,
    };
  }

  return {
    success: true,
    message: "sumsub applicant id updated",
    data: profileUpdated,
  };
};

export const resetPassword = async (values: ResetPasswordFormType) => {
  const paramsValid = await validateSimpleSchema(
    resetPasswordFormSchemaAction,
    values
  );
  if (!paramsValid.success) {
    return {
      ...paramsValid,
      data: false,
    };
  }
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: false,
    };
  }

  if (values.newPassword !== values.newPasswordConfirm) {
    return {
      success: false,
      message: "passwords_not_matching",
      data: false,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: values.newPassword,
  });

  if (error) {
    return {
      success: false,
      message: error.code ?? error.message,
      data: false,
    };
  }

  return {
    success: true,
    message: "password_updated",
    data: true,
  };
};

export const updateUserEmail = async (email: string) => {
  const paramsValid = await validateSimpleSchema(createEmailSchema, email);
  if (!paramsValid.success) {
    return {
      ...paramsValid,
      data: false,
    };
  }
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: false,
    };
  }

  const { error } = await supabase.auth.updateUser({
    email,
  });

  if (error) {
    return {
      success: false,
      message: error.code ?? error.message,
      data: false,
    };
  }

  return {
    success: true,
    message: "email_updated_confirm_email",
    data: true,
  };
};

export async function getBannedUserInfos(email: string, password: string) {
  const paramsValid = await validateSimpleSchema(createEmailSchema, email);
  if (!paramsValid.success) {
    return paramsValid;
  }
  const { data: bannedInfos, error } = await supabaseAdmin
    .schema("admin")
    .rpc("get_banned_user_infos", {
      p_email: email,
      p_plain_password: password,
    })
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
    message: "banned_infos_fetched",
    data: bannedInfos as {
      user_banned_until: string;
      ban_reason_message: string;
    },
  };
}

export async function updateNewsletterSubscribe(id: string, value: boolean) {
  if (typeof value !== "boolean") {
    return {
      success: false,
      message: "Invalid boolean value",
      data: null,
    };
  }
  const profileIdValid = validateUuid(id);
  if (!profileIdValid.success) {
    return profileIdValid;
  }

  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  if (user.id !== id) {
    return {
      success: false,
      message: "user_not_authorized",
      data: null,
    };
  }

  const { data: isSubscribe, error } = await supabaseAdmin
    .from("profiles")
    .update({ newsletter: value })
    .eq("id", id)
    .select("newsletter")
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
    message: "newsletter_updated",
    data: isSubscribe,
  };
}

export async function updateLanguage(language: "fr" | "en") {
  if (language !== "fr" && language !== "en") {
    return {
      success: false,
      message: "Invalid language",
      data: null,
    };
  }
  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  const { data: isSubscribe, error } = await supabaseAdmin
    .from("profiles")
    .update({ language })
    .eq("id", user.id)
    .select("language")
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
    message: "language_updated",
    data: isSubscribe,
  };
}

export async function deleteAccount(id: string) {
  const profileIdValid = validateUuid(id);
  if (!profileIdValid.success) {
    return profileIdValid;
  }
  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  if (user.id !== id) {
    return {
      success: false,
      message: "user_not_authorized",
      data: null,
    };
  }

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
    user.id,
    true
  );

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const subdomain = supabaseUrl?.split("//")[1].split(".")[0];
  const baseAuthCookieName = `sb-${subdomain}-auth-token`;

  const allCookies = await cookies();
  const cookieNames = allCookies.getAll().map((cookie) => cookie.name);

  cookieNames.forEach((cookieName) => {
    if (cookieName.startsWith(baseAuthCookieName)) {
      allCookies.delete(cookieName);
    }
  });

  return {
    success: true,
    message: "account_deleted",
    data,
  };
}

export async function acceptTerms() {
  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "user_not_authenticated",
      data: null,
    };
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ accept_terms_at: new Date() })
    .eq("id", user.id)
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
    message: "terms_accepted",
    data,
  };
}
