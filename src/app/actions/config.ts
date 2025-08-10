"use server";

import { revalidateTag } from "next/cache";
import { createServer } from "@/src/lib/supabase/server";

export async function updateGlobalMessage(
  newMessage: string,
  globalMessage: string | null,
  lang: string
) {
  const supabase = createServer();
  let updatedMessage = {} as Record<string, string | null>;

  if (globalMessage) {
    try {
      updatedMessage = JSON.parse(globalMessage);
    } catch (error) {
      updatedMessage = {};
    }
  }

  updatedMessage[lang] = newMessage.length > 0 ? newMessage : null;

  let query = supabase
    .from("config")
    .update({
      value: JSON.stringify(updatedMessage),
    })
    .eq("key", "global_message")
    .select("value")
    .single();

  const { error, data: updatedGlobalMessage } = await query;

  if (error) {
    return {
      success: false,
      data: null,
    };
  }

  revalidateTag("global_message");

  return {
    success: true,
    data: updatedGlobalMessage?.value as string,
  };
}
