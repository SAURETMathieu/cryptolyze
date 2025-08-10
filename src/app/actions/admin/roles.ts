"use server";

import { createServer } from "@/src/lib/supabase/server";

export async function getTablesPrivileges(schema: string, role: string) {
  const supabase = createServer();

  const { error, data: privileges } = await supabase
    .schema("admin")
    .rpc("get_tables_privileges", {
      input_schema: schema,
      input_role: role,
    })
    .order("table_name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Tables privileges fetched",
    data: privileges,
  };
}

export async function getColumnsPrivileges(
  schema: string,
  role: string,
  table: string
) {
  const supabase = createServer();

  const { error, data: privileges } = await supabase
    .schema("admin")
    .rpc("get_columns_privileges", {
      input_schema: schema,
      input_role: role,
      input_table_name: table,
    })
    .order("column");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Table columns privileges fetched",
    data: privileges,
  };
}

export async function getFunctionsPrivileges(schema: string, role: string) {
  const supabase = createServer();

  const { error, data: privileges } = await supabase
    .schema("admin")
    .rpc("get_functions_privileges", {
      input_schema: schema,
      input_role: role,
    })
    .order("function_name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Tables privileges fetched",
    data: privileges,
  };
}

export async function getSchemasPrivileges(role: string) {
  const supabase = createServer();

  const { error, data: privileges } = await supabase
    .schema("admin")
    .rpc("get_schemas_privileges", {
      input_role: role,
    })
    .order("schema_name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Schemas privileges fetched",
    data: privileges,
  };
}

export async function getRoles() {
  const supabase = createServer();

  const { error, data: roles } = await supabase
    .schema("admin")
    .rpc("get_roles")
    .order("name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Roles fetched",
    data: roles,
  };
}

export async function getSchemas() {
  const supabase = createServer();

  const { data: schemas, error } = await supabase
    .schema("admin")
    .rpc("get_schemas")
    .order("name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Roles fetched",
    data: schemas,
  };
}

export async function createRole(newRole: string) {
  const supabase = createServer();

  const { data: message, error } = await supabase
    .schema("admin")
    .rpc("insert_new_role", {
      role_name: newRole,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: message,
    data: message,
  };
}

export async function updateUserRole(newRole: string, userId: string) {
  const supabase = createServer();

  const { data: message, error } = await supabase
    .schema("admin")
    .rpc("update_user_role", {
      p_role: newRole,
      p_user_id: userId,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: message,
    data: message,
  };
}
