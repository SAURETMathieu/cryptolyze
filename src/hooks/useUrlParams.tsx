"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";

export function useURLParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams);
  const urlParams = useParams();
  const locale = useLocale();

  const updateQueryParams = (
    type: "push" | "replace",
    toSet: Record<string, string | number> = {},
    toRemove: string[] = [],
  ) => {
    Object.entries(toSet).forEach(([key, value]) => {
      query.set(key, String(value));
    });

    toRemove.forEach((key) => {
      query.delete(key);
    });

    router[type](
      {
        pathname: pathname as any,
        query: Object.fromEntries(query.entries()),
      },
      { locale },
    );
  };

  const updateFullUrl = (
    type: "push" | "replace",
    url: string | { pathname: string; params: any; query: any },
    keepQuery?: boolean,
  ) => {
    if (typeof url === "string") {
      router[type](
        {
          pathname: url as any,
          query: Object.fromEntries(keepQuery ? query.entries() : []),
        },
        { locale },
      );
    } else {
      router[type](
        {
          pathname: url.pathname as any,
          query: Object.fromEntries(keepQuery ? query.entries() : []),
        },
        { locale },
      );
    }
  };

  return { updateQueryParams, updateFullUrl };
}
