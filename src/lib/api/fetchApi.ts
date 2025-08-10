import { cache } from "react";
import { z } from "zod";

type DefaultApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: any[] | null;
  status: number;
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean | undefined | null>;
};

type FetchApiOptions<T> = FetchOptions & {
  schema?: z.ZodType<T>;
  defaultData?: T;
};

const buildUrl = (
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string => {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const fetchApi = async <T = any>(
  url: string,
  options: FetchApiOptions<T> = {}
): Promise<DefaultApiResponse<T>> => {
  const {
    method = "GET",
    headers = {},
    body,
    cache: cacheOption = "no-store",
    next,
    signal,
    schema,
    defaultData = null as T,
    params,
  } = options;

  const finalUrl = buildUrl(url, params);

  try {
    const response = await fetch(finalUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: cacheOption,
      next,
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "something_went_wrong",
      }));
      throw new Error(error.message || "something_went_wrong");
    }

    const data = await response.json();

    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw new Error("invalid_data");
      }
      return {
        success: true,
        message: data.message,
        data: result.data,
        errors: null,
        status: response.status,
      };
    }

    return {
      success: true,
      message: data.message,
      data,
      errors: null,
      status: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "something_went_wrong",
      data: defaultData,
      errors: null,
      status: 500,
    };
  }
};

// Version avec cache React
export const fetchApiCached = cache(fetchApi);

// Exemple d'utilisation :
/*
const getDeals = async (id: string, page = 1, limit = 10) => {
  return fetchApiCached<DealWithReferencesType[]>(
    `/api/deals/${id}`,
    {
      method: "GET",
      params: {
        page,
        limit,
        sort: "createdAt",
        order: "desc",
        search: "test",
      },
      next: {
        revalidate: 60,
        tags: ["deals"],
      },
      schema: z.array(dealSchema),
      defaultData: [],
    }
  );
};
*/
