"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/src/lib/supabase/server";

export async function getAllProfilesWithProInfos() {
  const supabase = createServer();

  let query = supabase
    .from("profiles")
    .select("*, company:pro_infos(*, address:incorporation_address(*))");

  const { error, data: profilesWithProInfos } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "All profiles fetched",
    data: profilesWithProInfos,
  };
}

export async function unbanProfile(profileId: string) {
  const supabase = createServer();

  let query = supabase.schema("admin").rpc("cancel_ban_profile", {
    p_profile_id: profileId,
  });

  const { error } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  revalidatePath("/admin/hub/profiles");

  return {
    success: true,
    message: "Profile unbanned",
    data: true,
  };
}

export async function getCompanyInfos(profileId: string) {
  const supabase = createServer();

  let query = supabase
    .from("pro_infos")
    .select("*, address:incorporation_address(*)")
    .eq("profile_id", profileId)
    .maybeSingle();

  const { error, data: companyInfos } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Company infos fetched",
    data: companyInfos,
  };
}

export async function getAvailableProfilesWithoutSupplier(search: string) {
  const supabase = createServer();

  const { error, data: profiles } = await supabase
    .schema("erp")
    .rpc("get_importable_profiles", {
      search_text: search,
    })
    .select("*");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Available profiles for supplier fetched",
    data: profiles,
  };
}
