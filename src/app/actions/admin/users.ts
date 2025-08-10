"use server";

import { createServer } from "@/src/lib/supabase/server";

import { getTeamMembersById } from "./teams";

export async function getUsersByEmail(
  email: string,
  withTeamMembers: boolean = true
) {
  const supabase = createServer();

  let query = supabase
    .from("profiles")
    .select("id, email")
    .ilike("email", `%${email}%`);

  if (!withTeamMembers) {
    query = query.eq("role", "User");
  }

  const { error, data: users } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "User fetched",
    data: users,
  };
}

export async function addTeamMember(id: string) {
  const supabase = createServer();

  let query = supabase.from("profiles").update({ role: "Team" }).eq("id", id);

  const { error, data: users } = await query;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  const {
    data: newTeamMember,
    message: newTeamMemberMessage,
    success: newTeamMemberSuccess,
  } = await getTeamMembersById(id);

  if (!newTeamMemberSuccess) {
    return {
      success: false,
      message: newTeamMemberMessage,
      data: null,
    };
  }

  return {
    success: true,
    message: "Team member added",
    data: newTeamMember,
  };
}
