import {
  getColumnsPrivileges,
  getFunctionsPrivileges,
  getRoles,
  getSchemas,
  getSchemasPrivileges,
  getTablesPrivileges,
} from "@/src/app/actions/admin/roles";

import { Unpacked } from "@/types/actions/actions.return.types";

// fetch all tables privileges types
type FetchTablesPrivilegesReturnType = ReturnType<typeof getTablesPrivileges>;

type FetchTablesPrivilegesResponseType =
  Awaited<FetchTablesPrivilegesReturnType> extends { data: infer D } ? D : null;

export type TablePrivilegesType = Unpacked<FetchTablesPrivilegesResponseType>;

// fetch all functions privileges types

type FetchFunctionsPrivilegesReturnType = ReturnType<
  typeof getFunctionsPrivileges
>;

type FetchFunctionsPrivilegesResponseType =
  Awaited<FetchFunctionsPrivilegesReturnType> extends { data: infer D }
    ? D
    : null;

export type FunctionPrivilegesType =
  Unpacked<FetchFunctionsPrivilegesResponseType>;

// fetch all schemas privileges types

type FetchSchemasPrivilegesReturnType = ReturnType<typeof getSchemasPrivileges>;

type FetchSchemasPrivilegesResponseType =
  Awaited<FetchSchemasPrivilegesReturnType> extends { data: infer D }
    ? D
    : null;

export type SchemaPrivilegesType = Unpacked<FetchSchemasPrivilegesResponseType>;

// fetch all roles types

type FetchRolesReturnType = ReturnType<typeof getRoles>;

type FetchRolesResponseType =
  Awaited<FetchRolesReturnType> extends { data: infer D } ? D : null;

export type RoleType = Unpacked<FetchRolesResponseType>;

// fetch all schemas types

type FetchSchemasReturnType = ReturnType<typeof getSchemas>;

type FetchSchemasResponseType =
  Awaited<FetchSchemasReturnType> extends { data: infer D } ? D : null;

export type SchemaType = Unpacked<FetchSchemasResponseType>;

// fetch all columns privileges types

type FetchColumnsPrivilegesReturnType = ReturnType<typeof getColumnsPrivileges>;

type FetchColumnsPrivilegesResponseType =
  Awaited<FetchColumnsPrivilegesReturnType> extends { data: infer D }
    ? D
    : null;

export type ColumnPrivilegesType = Unpacked<FetchColumnsPrivilegesResponseType>;
