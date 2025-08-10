import "server-only";

import { cookies } from "next/headers";

type DistinctsWithCountParamsType = {
  baseTable: string;
  joins: string;
  orderBy: string;
  castType: string;
};

type DistinctsWithCountResponseType = {
  distincts: { value: string; count: number }[];
  success: boolean;
  message: string;
};

export const fetchDistinctsWithCount = async (
  params: DistinctsWithCountParamsType
) => {
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
    const url = `${baseUrl}/api/admin/distincts-with-count?${urlParams.toString()}`;

    const res = await fetch(url, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "force-cache",
    });
    const { data: distincts, success, message } = await res.json();

    if (!success || !Array.isArray(distincts)) {
      throw new Error(message);
    }

    return {
      distincts: distincts as DistinctsWithCountResponseType["distincts"],
      success,
      message,
    };
  } catch (error) {
    console.error("Error fetching distincts with count:", error);
    return {
      distincts: [] as DistinctsWithCountResponseType["distincts"],
      success: false,
      message: (error as Error).message,
    };
  }
};
