import "server-only";

import { revalidateTag } from "next/cache";
import { TableMetasWithIcons } from "@/src/components/advanced-tables/types/advancedDatatableType";
import {
  getValidBasicFiltersFromObject,
  getValidFilters,
} from "@/src/components/advanced-tables/utils/data-table";
import {
  buildSupabaseAdvancedQuery,
  buildSupabaseBasicQuery,
} from "@/src/components/advanced-tables/utils/supabaseQueryBuilder";
import { createApiResponseWithCount } from "@/src/lib/api/createApiResponse";
import { getDictionnary } from "@/src/lib/api/getDictionnary";
import { withApiHandler } from "@/src/lib/api/withApiHandler";
import { createServer } from "@/src/lib/supabase/server";
import { createBaseAdvancedTableQuerySchema } from "@/src/schemas/api/baseQuerySchema";
import { createEnumSchema } from "@/src/schemas/utils";
import { parseJsonArrayOf } from "@/src/schemas/utils/parse/parseJsonToArray";
import { z } from "zod";

export interface AdvancedTableConfig {
  tableName: string;
  schema?: string;
  validKeys: Set<string>;
  defaultSorting?: { id: string; desc: boolean }[];
  maxPerPage?: number;
  columnsMapping: Record<string, string>;
  columnsBasicMapping?: Record<string, string | string[]>;
  metas?: TableMetasWithIcons;
  revalidateTag?: string;
  customFilters?: {
    [key: string]: {
      type: "string" | "number" | "enum" | "stringArray";
      enumValues?: string[];
      required?: boolean;
    };
  };
}

export function createAdvancedTableEndpoint<TData>(
  config: AdvancedTableConfig
) {
  const generateQuerySchema = (t: MessagesIntl) => {
    const baseSchema = createBaseAdvancedTableQuerySchema({
      t,
      validKeys: config.validKeys,
      defaultSorting: config.defaultSorting || [{ id: "id", desc: true }],
      maxPerPage: config.maxPerPage || 1000,
    });

    if (config.customFilters) {
      const customFilterSchema: Record<string, any> = {};

      Object.entries(config.customFilters).forEach(([key, filterConfig]) => {
        switch (filterConfig.type) {
          case "string":
            customFilterSchema[key] = filterConfig.required
              ? z.string().min(1)
              : z.string().default("");
            break;
          case "number":
            customFilterSchema[key] = parseJsonArrayOf(z.coerce.number());
            break;
          case "stringArray":
            customFilterSchema[key] = parseJsonArrayOf(z.string());
            break;
          case "enum":
            if (filterConfig.enumValues) {
              customFilterSchema[key] = parseJsonArrayOf(
                createEnumSchema(
                  filterConfig.enumValues,
                  t("required_params_custom", { param: key }),
                  t("invalid_params_custom", {
                    param: key,
                    enumsPossibles: filterConfig.enumValues.join(", "),
                  })
                )
              );
            }
            break;
        }
      });

      return baseSchema.extend(customFilterSchema);
    }

    return baseSchema;
  };

  type Validations = {
    query: ReturnType<typeof generateQuerySchema>;
  };

  return withApiHandler<TData[], Validations>(
    async (req, user, validatedData) => {
      const supabase = createServer();
      const {
        filters,
        page,
        perPage,
        joinOperator,
        sort,
        filterFlag,
        revalidate,
        ...customFilters
      } = validatedData.query;

      const offset = (page - 1) * perPage;

      let query = supabase
        .schema((config.schema as "public" | "admin" | "erp") || "erp")
        .from(config.tableName as keyof typeof supabase.schema)
        .select("*", { count: "exact" });

      if (filterFlag === "advancedFilters") {
        const validFilters = getValidFilters(filters);
        query = buildSupabaseAdvancedQuery(query, {
          filters: validFilters,
          sorts: sort,
          offset,
          perPage,
          joinOperator,
          columnsMapping: config.columnsMapping,
        });
      } else {
        const basicFilters = getValidBasicFiltersFromObject(customFilters);

        query = buildSupabaseBasicQuery(query, {
          filters: basicFilters,
          sorts: sort,
          offset,
          perPage,
          columnsMapping: config.columnsBasicMapping || config.columnsMapping,
          sortingMapping: config.columnsMapping,
          metas: config.metas,
        });
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (revalidate && config.revalidateTag) {
        revalidateTag(config.revalidateTag);
      }

      return createApiResponseWithCount(
        true,
        `${config.tableName}_fetched`,
        data as TData[],
        null,
        count ?? 0,
        200
      );
    },
    {
      requireAuth: true,
      requireTeam: true,
      defaultDataOnError: [],
      validations: async () => {
        const t = await getDictionnary("Forms");
        return {
          query: generateQuerySchema(t),
        };
      },
    }
  );
}
