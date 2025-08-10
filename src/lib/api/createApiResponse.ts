import "server-only";

import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export function createApiResponse<T>(
  success: boolean,
  message: string,
  data: T,
  errors: unknown[] | null,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success,
      message,
      data,
      errors,
      status,
    },
    { status }
  );
}

export function createApiResponseWithCount<T>(
  success: boolean,
  message: string,
  data: T,
  errors: unknown[] | null,
  count: number,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success,
      message,
      data,
      errors,
      count,
      status,
    },
    { status }
  );
}
