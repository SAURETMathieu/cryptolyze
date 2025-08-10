import {
  getAllProfilesWithProInfos,
  getAvailableProfilesWithoutSupplier,
} from "@/src/app/actions/admin/profiles";

import { Unpacked } from "../actions/actions.return.types";

// fetch best listings with variant and reference
type FetchAllProfilesReturnType = ReturnType<typeof getAllProfilesWithProInfos>;

type FetchAllProfilesResponseType =
  Awaited<FetchAllProfilesReturnType> extends { data: infer D } ? D : null;

export type ProfilesDetailled = Unpacked<FetchAllProfilesResponseType>;

// fetch profiles without supplier
type FetchProfilesWithoutSupplierReturnType = ReturnType<
  typeof getAvailableProfilesWithoutSupplier
>;

type FetchProfilesWithoutSupplierResponseType =
  Awaited<FetchProfilesWithoutSupplierReturnType> extends { data: infer D }
    ? D
    : null;

export type ProfilesWithoutSupplierType =
  Unpacked<FetchProfilesWithoutSupplierResponseType>;
