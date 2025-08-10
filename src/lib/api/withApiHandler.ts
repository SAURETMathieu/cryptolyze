import "server-only";

import { ApiResponse } from "@/types";
import { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUserInfos } from "@/src/lib/api/getUserInfos";
import { logger } from "../logger";
import {
  createApiResponse,
  createApiResponseWithCount,
} from "./createApiResponse";

export type ValidationsSchema = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

type ValidationData<V extends ValidationsSchema> = {
  body: V["body"] extends z.ZodType<any, any, any> ? z.infer<V["body"]> : never;
  params: V["params"] extends z.ZodType<any, any, any>
    ? z.infer<V["params"]>
    : never;
  query: V["query"] extends z.ZodType<any, any, any>
    ? z.infer<V["query"]>
    : never;
};

type ApiHandler<V extends ValidationsSchema = {}, T = unknown> = (
  req: NextRequest,
  user: User | null,
  validatedData: ValidationData<V>,
) => Promise<NextResponse<ApiResponse<T>>>;

type ApiHandlerOptions<T = unknown, V extends ValidationsSchema = {}> = {
  requireAuth?: boolean;
  defaultDataOnError?: T | null;
  withCount?: boolean;
  requireTeam?: boolean;
  validations?: V | (() => Promise<V>);
  showAllValidationErrors?: boolean;
};

function handleErrorWithCount<T>(
  error: any,
  defaultData: T | null,
  statusCode: number,
  withCount: boolean,
): NextResponse<ApiResponse<T>> {
  const message = error?.message || "internal_server_error";

  if (withCount) {
    return createApiResponseWithCount(
      false,
      message,
      defaultData as T,
      [],
      0,
      statusCode,
    );
  }
  return createApiResponse(false, message, defaultData as T, [], statusCode);
}

function handleValidationError<T>(
  error: z.ZodError,
  showAllErrors: boolean,
  defaultDataOnError: T | null,
): NextResponse<ApiResponse<T>> {
  const errors = showAllErrors ? error.errors : [error.errors[0]];

  return createApiResponse(
    false,
    "validation_error",
    defaultDataOnError as T,
    errors,
    400,
  );
}

export function withApiHandler<T, V extends ValidationsSchema = {}>(
  handler: ApiHandler<V, T>,
  options: ApiHandlerOptions<T, V> = {},
) {
  const {
    requireAuth = false,
    defaultDataOnError = [] as T,
    withCount = false,
    requireTeam = false,
    validations,
    showAllValidationErrors = true,
  } = options;

  return async function wrappedHandler(
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ): Promise<NextResponse<ApiResponse<T>>> {
    const isDev = process.env.NODE_ENV !== "production";
    try {
      // Datas validation
      const validatedData: ValidationData<V> = {} as ValidationData<V>;
      const resolvedValidations =
        typeof validations === "function" ? await validations() : validations;

      if (resolvedValidations) {
        // Body validation
        if (resolvedValidations.body) {
          const body = await req.json();
          const schema = resolvedValidations.body;
          const result = schema.safeParse(body);
          if (!result.success) {
            return handleValidationError(
              result.error,
              showAllValidationErrors,
              defaultDataOnError,
            );
          }
          validatedData.body = result.data;
        }

        // Params validation
        if (resolvedValidations.params) {
          const urlParams = await params;
          const schema = resolvedValidations.params;
          const result = schema.safeParse(urlParams);
          if (!result.success) {
            return handleValidationError(
              result.error,
              showAllValidationErrors,
              defaultDataOnError,
            );
          }
          validatedData.params = result.data;
        }

        // Query params validation
        if (resolvedValidations.query) {
          const { searchParams } = new URL(req.url);
          const params = Object.fromEntries(searchParams.entries());
          const schema = resolvedValidations.query;
          const result = schema.safeParse(params);
          if (!result.success) {
            return handleValidationError(
              result.error,
              showAllValidationErrors,
              defaultDataOnError,
            );
          }
          validatedData.query = result.data;
        }
      }

      // Check if authentication is required
      let user: User | null = null;
      if (requireAuth || requireTeam) {
        const { user: fetchedUser } = await getUserInfos(requireTeam);
        user = fetchedUser;
      }

      // Call the handler with the authenticated user and validated data
      return await handler(req, user, validatedData);
    } catch (error: any) {
      logger.error("API", error);

      const message = error?.message?.toLowerCase?.() || "internal_error";

      if (
        message.includes("permission denied") ||
        message.includes("forbidden")
      ) {
        error.message = isDev ? message : "forbidden";
        return handleErrorWithCount(error, defaultDataOnError, 403, withCount);
      }

      if (message.includes("user_not_authenticated")) {
        error.message = isDev ? message : "unauthorized";
        return handleErrorWithCount(error, defaultDataOnError, 401, withCount);
      }

      if (
        message.includes("resource_not_found") ||
        message.includes("not_found")
      ) {
        error.message = isDev ? message : "not_found";
        return handleErrorWithCount(error, defaultDataOnError, 404, withCount);
      }

      error.message = isDev ? message : "internal_server_error";

      return handleErrorWithCount(error, defaultDataOnError, 500, withCount);
    }
  };
}
