"use server";

import { createServer } from "@/src/lib/supabase/server";

export async function getTeamMembers() {
  const supabase = createServer();

  const { error, data: teamMembers } = await supabase
    .schema("admin")
    .from("get_profiles_with_auth_view")
    .select("*")
    .order("last_name, first_name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Team members fetched",
    data: teamMembers,
  };
}

export async function getTeamMembersById(id: string) {
  const supabase = createServer();

  const { error, data: teamMember } = await supabase
    .schema("admin")
    .from("get_profiles_with_auth_view")
    .select("*")
    .eq("id", id)
    .order("last_name, first_name")
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
    message: "Team members fetched",
    data: teamMember,
  };
}

export async function deleteTeamMembers(
  idsToDeleteFromTeam: (string | number)[]
) {
  const supabase = createServer();

  const { error, data } = await supabase
    .from("profiles")
    .update({ role: "User" })
    .in("id", idsToDeleteFromTeam as string[]);

  if (error) {
    return {
      success: false,
      message: error?.message ?? "Error deleting member",
    };
  }

  return {
    success: true,
    message: "Member deleted",
  };
}
