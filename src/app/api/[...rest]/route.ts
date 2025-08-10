import { createApiResponse } from "@/src/lib/api/createApiResponse";
import { withApiHandler } from "@/src/lib/api/withApiHandler";

export const GET = withApiHandler(
  async () => {
    return createApiResponse(false, "route_not_found", null, null, 404);
  },
  {
    requireAuth: false,
    defaultDataOnError: null,
  }
);

export const POST = GET;
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
