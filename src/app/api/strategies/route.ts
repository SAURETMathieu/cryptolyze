// import { createApiResponse } from "@/src/lib/api/createApiResponse";
// import { withApiHandler } from "@/src/lib/api/withApiHandler";
// import { createServer } from "@/src/lib/supabase/server";

// export const POST = withApiHandler<any>(
//   async (req, user) => {
//     const supabase = createServer();
//     const { body } = req;

//     // Vérifier si la stratégie existe déjà
//     const { data: existingStrategy, error: checkError } = await supabase
//       .from("strategy")
//       .select("id")
//       .eq("name", body.name)
//       .single();

//     if (checkError && checkError.code !== "PGRST116") {
//       throw new Error(checkError.message);
//     }

//     if (existingStrategy) {
//       return createApiResponse(
//         false,
//         "strategy_already_exists",
//         null,
//         "Une stratégie avec ce nom existe déjà",
//         409
//       );
//     }

//     // Créer la nouvelle stratégie
//     const { data: newStrategy, error: createError } = await supabase
//       .from("strategy")
//       .insert({
//         name: body.name,
//         description: body.description || "No description",
//         execution_delay: body.execution_delay || 60,
//         percent_per_trade_up: body.percent_per_trade_up || 1,
//         percent_per_trade_down: body.percent_per_trade_down || 1,
//         multiplier: body.multiplier || 1,
//         starting_multiplier: body.starting_multiplier || 1,
//       })
//       .select()
//       .single();

//     if (createError) {
//       throw new Error(createError.message);
//     }

//     return createApiResponse(true, "strategy_created", newStrategy, null, 201);
//   },
//   {
//     requireAuth: true,
//     defaultDataOnError: null,
//   }
// );

// export const GET = withApiHandler<any>(
//   async (req, user) => {
//     const supabase = createServer();
//     const { data, error } = await supabase
//       .from("strategy")
//       .select(`*`)
//       .order("created_at", { ascending: false });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return createApiResponse(true, "strategies_fetched", data, null, 200);
//   },
//   {
//     requireAuth: false,
//     defaultDataOnError: [],
//   }
// );
