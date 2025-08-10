import "server-only";

import { cookies } from "next/headers";
import { flagConfig } from "@/src/components/advanced-tables/config/flag";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/src/components/advanced-tables/utils/parsers";
import { FetchResult } from "@/types";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

export const suiviSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value)
  ),
  revalidate: parseAsString.withDefault("0"),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(50),
  sort: getSortingStateParser<any>().withDefault([{ id: "id", desc: false }]),
  // basic filter
  status: parseAsArrayOf(z.string()).withDefault([]),
  language: parseAsArrayOf(z.string()).withDefault([]),
  brand: parseAsArrayOf(z.string()).withDefault([]),
  size: parseAsArrayOf(z.string()).withDefault([]),
  customer: parseAsString.withDefault(""),
  date: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetSuiviSchemaType = Awaited<
  ReturnType<typeof suiviSearchParamsCache.parse>
>;

export const fetchAllSuivis = async (
  params: GetSuiviSchemaType
): FetchResult<any[]> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const queryParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value),
      ])
    );
    const urlParams = new URLSearchParams(queryParams);
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const url = `${baseUrl}/api/admin/suivis?${urlParams.toString()}`;

    const reload = params.revalidate && params.revalidate !== "0";

    const res = await fetch(url, {
      headers: {
        Cookie: cookieHeader,
      },
      next: { tags: ["/admin/sav/suivi"], revalidate: 900 },
      cache: reload ? "reload" : "force-cache",
    });
    const {
      data: fetchedSuivis,
      success,
      message,
      count,
      errors,
    } = await res.json();

    if (!success || !Array.isArray(fetchedSuivis)) {
      throw new Error(
        errors && errors.length > 0 ? errors[0]?.message : message
      );
    }

    return {
      data: fetchedSuivis,
      count,
      success,
      message,
    };
  } catch (error) {
    console.error("Error fetching suivis:", error);
    return {
      data: [],
      count: 0,
      success: false,
      message: (error as Error).message,
    };
  }
};
