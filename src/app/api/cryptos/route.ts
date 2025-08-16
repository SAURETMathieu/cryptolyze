// import { createApiResponse } from "@/src/lib/api/createApiResponse";
// import { withApiHandler } from "@/src/lib/api/withApiHandler";
// import { createServer } from "@/src/lib/supabase/server";

// export const GET = withApiHandler<any>(
//   async (req, user) => {
//     const supabase = createServer();
//     const { data, error } = await supabase
//       .from("crypto")
//       .select(`*`)
//       .order("name", { ascending: true });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return createApiResponse(true, "cryptos_fetched", data, null, 200);
//   },
//   {
//     requireAuth: true,
//     defaultDataOnError: [],
//   }
// );
