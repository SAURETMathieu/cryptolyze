"use client";

import { RoleType } from "@/types/admin/role";
import { TeamMemberType } from "@/types/admin/teams";

import { TeamMemberCard } from "./TeamMemberCard";

export function TeamMembersList({
  teamMembersState,
  setTeamMembersState,
  roles,
}: {
  teamMembersState: TeamMemberType[];
  setTeamMembersState: React.Dispatch<React.SetStateAction<TeamMemberType[]>>;
  roles: RoleType[];
}) {
  return (
    <>
      {teamMembersState.length > 0 ? (
        teamMembersState.map((member, index) => (
          <TeamMemberCard
            key={index}
            teamMember={member}
            roles={roles}
            setTeamMembersState={setTeamMembersState}
          />
        ))
      ) : (
        <div className="text-muted-foreground">No team members found</div>
      )}
    </>
  );
}
