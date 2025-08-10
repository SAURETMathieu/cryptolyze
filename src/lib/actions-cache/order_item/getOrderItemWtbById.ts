import "server-only";

import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createServer } from "@/src/lib/supabase/server";

export async function getOrderItemWtbById(
  cookies: Promise<ReadonlyRequestCookies>,
  orderItemId: number
) {
  return await unstable_cache(
    async () => {
      const supabase = createServer(cookies);
      const { error, data: orderItem } = await supabase
        .schema("erp")
        .from("order_item_wtb")
        .select("*, order(*), product(*)")
        .eq("id", orderItemId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return orderItem ?? null;
    },
    ["order_item_wtb", `${orderItemId}`],
    {
      revalidate: 60,
      tags: [`/admin/order-item-wtb/${orderItemId}`],
    }
  )();
}
