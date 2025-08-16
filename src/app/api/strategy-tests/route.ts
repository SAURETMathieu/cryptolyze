// import { createApiResponse } from "@/src/lib/api/createApiResponse";
// import { withApiHandler } from "@/src/lib/api/withApiHandler";
// import { createServer } from "@/src/lib/supabase/server";

// export const GET = withApiHandler<any>(
//   async (req, user) => {
//     const supabase = createServer();
//     const { searchParams } = new URL(req.url);
//     const strategyId = searchParams.get("strategy_id");
//     const cryptoId = searchParams.get("crypto_id");
//     const year = searchParams.get("year");

//     let query = supabase
//       .from("strategy_test")
//       .select(
//         `
//         *,
//         crypto:crypto_id(*),
//         strategy:strategy_id(*)
//       `
//       )
//       .order("year", { ascending: false });

//     if (strategyId) {
//       query = query.eq("strategy_id", strategyId);
//     }

//     if (cryptoId) {
//       query = query.eq("crypto_id", cryptoId);
//     }

//     if (year) {
//       query = query.eq("year", year);
//     }

//     const { data, error } = await query;

//     if (error) {
//       throw new Error(error.message);
//     }

//     return createApiResponse(true, "strategy_tests_fetched", data, null, 200);
//   },
//   {
//     requireAuth: true,
//     defaultDataOnError: [],
//   }
// );

// export const POST = withApiHandler<any>(
//   async (req, user) => {
//     const supabase = createServer();
//     const { body } = req;

//     // Vérifier si le test existe déjà
//     const { data: existingTest, error: checkError } = await supabase
//       .from("strategy_test")
//       .select("id")
//       .eq("strategy_id", body.strategy_id)
//       .eq("crypto_id", body.crypto_id)
//       .eq("year", body.year)
//       .single();

//     if (checkError && checkError.code !== "PGRST116") {
//       throw new Error(checkError.message);
//     }

//     if (existingTest) {
//       return createApiResponse(
//         false,
//         "strategy_test_already_exists",
//         null,
//         "Un test pour cette stratégie, crypto et année existe déjà",
//         409
//       );
//     }

//     // Ici vous pouvez ajouter la logique pour générer le test
//     // Pour l'instant, on crée juste un enregistrement vide
//     const { data: newTest, error: createError } = await supabase
//       .from("strategy_test")
//       .insert({
//         strategy_id: body.strategy_id,
//         crypto_id: body.crypto_id,
//         year: body.year,
//         starting_price: 0,
//         ending_price: 0,
//         average_price: 0,
//         percent: 0,
//         max_trade_open: 0,
//         average_trade_open: 0,
//         max_invest: 0,
//         nb_token: 0,
//         fees: 0,
//         nb_trade_closed: 0,
//         nb_trade_open: 0,
//         profit: 0,
//         profit_percent: 0,
//       })
//       .select()
//       .single();

//     if (createError) {
//       throw new Error(createError.message);
//     }

//     return createApiResponse(true, "strategy_test_created", newTest, null, 201);
//   },
//   {
//     requireAuth: false,
//     defaultDataOnError: null,
//   }
// );
