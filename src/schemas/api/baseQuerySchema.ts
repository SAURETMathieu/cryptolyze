import {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/src/components/advanced-tables/types/advancedDatatableType";
import {
  filterItemSchema,
  sortingItemSchema,
} from "@/src/components/advanced-tables/utils/parsers";
import { createEnumSchema, createNumberSchema } from "@/src/schemas/utils";
import { z } from "zod";

type JoinOperatorType = "and" | "or";

interface CreateBaseAdvancedTableQuerySchemaProps {
  t: MessagesIntl;
  validKeys?: Set<string>;
  defaultSorting?: ExtendedColumnSort<any>[];
  defaultFilters?: ExtendedColumnFilter<any>[];
  minPerPage?: number;
  maxPerPage?: number;
  defaultPerPage?: number;
}

export const createBaseAdvancedTableQuerySchema = ({
  t,
  validKeys = new Set(),
  defaultSorting = [],
  defaultFilters = [],
  maxPerPage = 600,
  minPerPage = 1,
  defaultPerPage = 50,
}: CreateBaseAdvancedTableQuerySchemaProps) => {
  const baseSchema = {
    filters: z
      .preprocess((val) => {
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return val;
      }, z.array(filterItemSchema))
      .transform((value) => {
        if (validKeys && value.some((item) => !validKeys.has(item.id))) {
          return [];
        }
        return value as ExtendedColumnFilter<any>[];
      })
      .default(defaultFilters ?? []),
    page: createNumberSchema({
      dictionnary: t,
      invalidError: "invalid_params_page",
      min: 1,
      minError: "min_params_page",
      defaultValue: 1,
    }),
    perPage: createNumberSchema({
      dictionnary: t,
      min: minPerPage,
      minError: "min_params_limit",
      max: maxPerPage,
      maxError: "max_params_limit",
      defaultValue: defaultPerPage,
    }),
    joinOperator: createEnumSchema<JoinOperatorType>(
      ["and", "or"],
      undefined,
      t("invalid_params_joinOperator")
    ),
    revalidate: z.preprocess((revalidate) => {
      if (revalidate && revalidate !== "0") {
        return true;
      }
      return false;
    }, z.boolean().default(false)),
    filterFlag: z
      .enum(["advancedFilters", "null"])
      .optional()
      .nullable()
      .default(null),
    sort: z
      .preprocess((val) => {
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return val;
      }, z.array(sortingItemSchema))
      .transform((value) => {
        try {
          if (validKeys && value.some((item) => !validKeys.has(item.id))) {
            return [];
          }
          return value as ExtendedColumnSort<any>[];
        } catch {
          return [];
        }
      })
      .default(defaultSorting ?? []),
  };

  return z.object(baseSchema);
};
