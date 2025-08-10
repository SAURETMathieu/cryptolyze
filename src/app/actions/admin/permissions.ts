"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/src/lib/supabase/server";

import { TablePrivilegesType } from "@/types/admin/role";

import { getTablesPrivileges } from "./roles";

export async function updatePermissions(permissions: any[]) {
  const supabase = createServer();

  const { data: isSuccess, error } = await supabase
    .schema("admin")
    .rpc("update_permissions", {
      p_permissions: permissions,
    });

  if (error || !isSuccess) {
    return {
      success: false,
      message: error?.message ?? "Error updating permissions",
      data: isSuccess,
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Permissions updated successfully",
    data: isSuccess,
  };
}

export async function updateExecuteFunction(permissions: any[]) {
  const supabase = createServer();

  const { data: isSuccess, error } = await supabase
    .schema("admin")
    .rpc("update_function_permissions", {
      p_permissions: permissions,
    });

  if (error || !isSuccess) {
    return {
      success: false,
      message: error?.message ?? "Error updating function permissions",
      data: isSuccess,
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Function permissions updated successfully",
    data: isSuccess,
  };
}

export async function updateSchemasPermissions(permissions: any[]) {
  const supabase = createServer();

  const { data: isSuccess, error } = await supabase
    .schema("admin")
    .rpc("update_schemas_permissions", {
      p_permissions: permissions,
    });

  if (error || !isSuccess) {
    return {
      success: false,
      message: error?.message ?? "Error updating schemas permissions",
      data: isSuccess,
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Schemas permissions updated successfully",
    data: isSuccess,
  };
}

export async function updateColumnsPermissions(permissions: any[]) {
  const supabase = createServer();

  const { data: isSuccess, error } = await supabase
    .schema("admin")
    .rpc("update_columns_permissions", {
      p_permissions: permissions,
    });

  if (error || !isSuccess) {
    return {
      success: false,
      message: error?.message ?? "Error updating columns permissions",
      data: isSuccess,
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Columns permissions updated successfully",
    data: isSuccess,
  };
}

export async function initRolePermissions(schemas: string[], role: string) {
  const supabase = createServer();

  let allTables: TablePrivilegesType[] = [];

  for (const schema of schemas) {
    const { data, success, message } = await getTablesPrivileges(schema, role);

    if (!success) {
      return {
        success: false,
        message: `Error fetching permissions for schema ${schema}: ` + message,
        data: [],
      };
    }

    const tables = data.filter((table) => table.table_type !== "VIEW");

    const schemaPermissions = tables.map((table) => {
      return {
        ...table,
        schema_name: table.table_schema,
        table_name: table.table_name,
        role_name: table.grantee,
      };
    });

    allTables = [...allTables, ...schemaPermissions];
  }

  const tables = allTables.filter((table) => table.table_type !== "VIEW");

  const initialPermissions = tables.map((table) => {
    return {
      ...table,
      schema_name: table.table_schema,
      table_name: table.table_name,
      role_name: table.grantee,
    };
  });

  const { data: isSuccess, error } = await supabase
    .schema("admin")
    .rpc("update_permissions", {
      p_permissions: initialPermissions,
    });

  if (error || !isSuccess) {
    return {
      success: false,
      message: error?.message ?? "Error initializing role permissions",
      data: isSuccess,
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Role permissions initialized",
    data: isSuccess,
  };
}

export async function revokeTablePermission(
  schema: string,
  role: string,
  table: string,
  verb: "can_insert" | "can_update" | "can_select" | "can_reference"
) {
  const supabase = createServer();

  const { error, count } = await supabase
    .from("role_permissions")
    .delete({ count: "exact" })
    .eq("role", role)
    .eq("permission", schema + "." + table + "." + verb.substring(4));

  if (error || !count) {
    return {
      success: false,
      message: error?.message ?? "Error deleting permissions",
    };
  }

  revalidatePath("/admin/permissions");

  return {
    success: true,
    message: "Permission revoked",
  };
}
