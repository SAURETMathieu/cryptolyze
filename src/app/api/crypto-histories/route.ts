import { createApiResponse } from "@/src/lib/api/createApiResponse";
import { withApiHandler } from "@/src/lib/api/withApiHandler";
import { createServer } from "@/src/lib/supabase/server";

export const GET = withApiHandler<any>(
  async (req, user) => {
    const supabase = createServer();
    const { data, error } = await supabase
      .from("crypto_yearly_history_status")
      .select(`*`)
      .order("symbol", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return createApiResponse(true, "crypto_histories_fetched", data, null, 200);
  },
  {
    requireAuth: false,
    defaultDataOnError: [],
  }
);
