import { Metadata } from "next";
import { getRoles } from "@/src/app/actions/admin/roles";
import { getTeamMembers } from "@/src/app/actions/admin/teams";
import { AdminTeamsMain } from "@/src/pages/Admin/Team/AdminTeamsPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration - Teams",
  };
}

export default async function AdminTeamsPage() {
  const { data: teamMembers } = await getTeamMembers();
  const { data: roles } = await getRoles();

  return <AdminTeamsMain teamMembers={teamMembers} roles={roles} />;
}
