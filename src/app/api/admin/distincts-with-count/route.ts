import { postgresCast } from "@/src/data/postgresCast";
import { createApiResponse } from "@/src/lib/api/createApiResponse";
import { getDictionnary } from "@/src/lib/api/getDictionnary";
import { withApiHandler } from "@/src/lib/api/withApiHandler";
import { createServer } from "@/src/lib/supabase/server";
import { createEnumSchema, createStringSchema } from "@/src/schemas/utils";
import { createDistinctSqlRequest } from "@/src/utils";
import { z } from "zod";

const joinsPattern = /^(?:[a-z_]+\.[a-z_]+\([a-z_]+->[a-z_]+\)\.)*[a-z_]+$/;
const baseTablePattern = /^[a-z_]+\.[a-z_]+$/;

const generateQuerySchema = (t: MessagesIntl) =>
  z.object({
    baseTable: createStringSchema({
      requiredError: "required_params_baseTable",
      invalidError: "invalid_params_baseTable",
      dictionnary: t,
      minLength: 1,
      regex: baseTablePattern,
      regexError: "invalid_params_baseTable_regex",
    }),
    joins: createStringSchema({
      requiredError: "required_params_joins",
      invalidError: "invalid_params_joins",
      dictionnary: t,
      regex: joinsPattern,
      regexError: "invalid_params_joins",
    }),
    orderBy: createEnumSchema(
      ["ASC", "DESC"],
      undefined,
      t("invalid_params_orderBy")
    ),
    castType: createEnumSchema(
      postgresCast,
      undefined,
      t("invalid_params_castType", { postgresCast: postgresCast.join(", ") })
    ),
  });

type Validations = {
  query: ReturnType<typeof generateQuerySchema>;
};

export const GET = withApiHandler<
  { value: string; count: number }[] | null,
  Validations
>(
  async (req, user, validatedData) => {
    const supabase = createServer();
    const p_request = createDistinctSqlRequest(
      validatedData.query.baseTable,
      validatedData.query.joins,
      validatedData.query.orderBy ?? "ASC",
      validatedData.query.castType ?? "text"
    );

    const { data: elements, error } = await supabase
      .schema("erp")
      .rpc("execute_distinct_request", {
        p_request,
      });

    if (error) {
      throw new Error(error.message);
    }

    return createApiResponse(true, "distincts_fetched", elements, null, 200);
  },
  {
    requireTeam: true,
    requireAuth: true,
    defaultDataOnError: [],
    showAllValidationErrors: true,
    validations: async () => {
      const t = await getDictionnary("Forms");
      return {
        query: generateQuerySchema(t),
      };
    },
  }
);
