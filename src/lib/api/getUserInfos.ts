import "server-only";

import { createServer } from "@/src/lib/supabase/server";

const TEAM_ROLES = ["service_role", "supabase_admin"];

export async function getUserInfos(requireTeam: boolean = false) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("user_not_authenticated");
  }

  if (requireTeam && !TEAM_ROLES.includes(user?.role ?? "anon")) {
    throw new Error("forbidden");
  }
  return { user, error: null };
}
