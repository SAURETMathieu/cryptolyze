import { getTeamMembers } from "@/src/app/actions/admin/teams";

import { Unpacked } from "../actions/actions.return.types";

// fetch all tables privileges types
type FetchTeamMembersReturnType = ReturnType<typeof getTeamMembers>;

type FetchTeamMemberResponseType =
  Awaited<FetchTeamMembersReturnType> extends { data: infer D } ? D : null;

export type TeamMemberType = Unpacked<FetchTeamMemberResponseType>;
