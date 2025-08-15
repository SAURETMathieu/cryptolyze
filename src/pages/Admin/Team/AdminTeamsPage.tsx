"use client";

import { useState } from "react";

import { RoleType } from "@/types/admin/role";
import { TeamMemberType } from "@/types/admin/teams";

import AddTeamMemberButton from "./AddTeamMemberButton";
import { TeamMembersList } from "./TeamMembersList";

export function AdminTeamsMain({
  teamMembers,
  roles,
}: {
  teamMembers: TeamMemberType[];
  roles: RoleType[];
}) {
  const [teamMembersState, setTeamMembersState] = useState(teamMembers);
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Membre de l&apos;équipe
        </h1>
        <h2 className="text-muted-foreground my-2">
          Gérer les membres de l&apos;équipe
        </h2>
      </div>
      <div className="">
        <AddTeamMemberButton setTeamMembersState={setTeamMembersState} />
      </div>
      <section className="my-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <TeamMembersList
          teamMembersState={teamMembersState}
          roles={roles}
          setTeamMembersState={setTeamMembersState}
        />
      </section>
    </>
  );
}
