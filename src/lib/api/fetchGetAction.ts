import "server-only";

import { cookies } from "next/headers";
import { FetchResult } from "@/types";

export const fetchGetAction = async <T>({
  url,
  tags = [],
  reload,
  revalidate,
  cache = "default",
}: {
  url: `/${string}`;
  tags?: string[];
  reload?: boolean;
  revalidate?: number;
  cache?: RequestCache;
}): FetchResult<T> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const fullUrl = `${baseUrl}${url}`;

    const res = await fetch(fullUrl, {
      headers: {
        Cookie: cookieHeader,
      },
      next: { tags, revalidate },
      cache: reload ? "reload" : cache,
    });
    const { data, success, message, count } = await res.json();

    if (!success || !data) {
      throw new Error(message);
    }

    return {
      data,
      count: count ?? 0,
      success,
      message,
    };
  } catch (error) {
    console.error("Error fetching purchases:", error);
    const fallback: any = [] as any as T extends any[]
      ? NonNullable<T>
      : NonNullable<T> | null;

    return {
      data: fallback,
      count: 0,
      success: false,
      message: (error as Error).message,
    };
  }
};
