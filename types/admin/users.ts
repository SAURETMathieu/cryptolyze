import { getUsersByEmail } from "@/src/app/actions/admin/users";

import { Unpacked } from "../actions/actions.return.types";

// fetch all users by email
type FetchUsersByEmailReturnType = ReturnType<typeof getUsersByEmail>;

type FetchUsersByEmailResponseType =
  Awaited<FetchUsersByEmailReturnType> extends { data: infer D } ? D : null;

export type UsersByEmail = Unpacked<FetchUsersByEmailResponseType>;
