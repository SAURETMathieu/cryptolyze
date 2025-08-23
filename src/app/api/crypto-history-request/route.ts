import { createApiResponse } from "@/src/lib/api/createApiResponse";
import { withApiHandler } from "@/src/lib/api/withApiHandler";
import { createServer } from "@/src/lib/supabase/server";
import z from "zod";

const bodySchema = () =>
  z.object({
    crypto_id: z.number(),
    year: z.number(),
  });

interface Validations {
  body: ReturnType<typeof bodySchema>;
}

export const POST = withApiHandler<any, Validations>(
  async (req, user, { body }) => {
    const { crypto_id, year } = body;

    const supabase = createServer();
    const { data, error } = await supabase
      .rpc("request_crypto_day_history", {
        p_crypto_id: crypto_id,
        p_year: year,
      })
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return createApiResponse(
      true,
      "crypto_day_history_requested",
      data,
      null,
      200
    );
  },
  {
    requireAuth: false,
    defaultDataOnError: [],
    validations: {
      body: bodySchema(),
    },
  }
);
