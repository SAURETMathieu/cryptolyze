import "server-only";

import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createServer } from "@/src/lib/supabase/server";

export async function getGlobalMessage(
  cookies: Promise<ReadonlyRequestCookies>
) {
  return await unstable_cache(
    async () => {
      const supabase = createServer(cookies);
      const { data, error } = await supabase
        .from("config")
        .select("value")
        .eq("key", "global_message")
        .single();

      if (error) throw new Error(error.message);
      return data?.value ?? null;
    },
    ["global_message"],
    { revalidate: 900, tags: ["global_message"] }
  )();
}
