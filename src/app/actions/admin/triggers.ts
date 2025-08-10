"use server";

import { createServer } from "@/src/lib/supabase/server";

export async function getTriggers() {
  const supabase = createServer();

  const { error, data: triggers } = await supabase
    .schema("admin")
    .from("triggers_with_details")
    .select("*")
    .order("table_name, trigger_name");

  if (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }

  return {
    success: true,
    message: "Triggers fetched",
    data: triggers,
  };
}

export async function toogleTriggerInDatabase(trigger: any) {
  const supabase = createServer();

  if (trigger.enabled === "D") {
    const { error } = await supabase.schema("admin").rpc("enable_trigger", {
      trigger_schema: trigger.table_schema,
      trigger_table: trigger.table_name,
      trigger_name: trigger.trigger_name,
    });
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  } else {
    const { error } = await supabase.schema("admin").rpc("disable_trigger", {
      trigger_schema: trigger.table_schema,
      trigger_table: trigger.table_name,
      trigger_name: trigger.trigger_name,
    });
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  return {
    success: true,
    message: "Trigger updated",
  };
}
