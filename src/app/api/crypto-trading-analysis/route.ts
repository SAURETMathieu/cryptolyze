import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/src/lib/supabase/server";

// Types pour les paramètres de requête
interface TradingAnalysisParams {
  crypto: string;
  year: string;
}

// Types pour les trades
interface Trade {
  id: number;
  buyPrice: number;
  sellPrice?: number;
  status: "open" | "closed";
  profit?: number;
  fees: number;
  amount: number;
  tradeAmount: number; // Montant investi dans ce trade (avec multiplicateur)
  buyTimestamp?: number; // Index dans le tableau de prix
  sellTimestamp?: number; // Index dans le tableau de prix
}

// Types pour les données de prix avec date
interface PriceData {
  price: number;
  date: string; // Date du jour
  minuteIndex: number; // Index dans la journée (0-1439)
}

// Types pour les résultats d'analyse d'une stratégie
interface StrategyAnalysisResult {
  strategy_id: number;
  crypto_id: number;
  year: number;
  starting_price: number;
  ending_price: number;
  average_price: number;
  percent: number;
  max_trade_open: number;
  average_trade_open: number;
  max_invest: number;
  nb_token: number;
  fees: number;
  nb_trade_closed: number;
  nb_trade_open: number;
  profit: number;
  profit_percent: number;
  dailyHistory: {
    date: string;
    nb_token: number;
    max_trade_open: number;
    average_trade_open: number;
    average_price: number;
    max_invest: number;
    nb_trade_closed: number;
    nb_trade_open: number;
    profit: number;
    profit_percent: number;
  }[];
}

// Types pour la réponse finale
interface TradingAnalysisResponse {
  crypto: string;
  year: number;
  results: StrategyAnalysisResult[];
}

// Configuration des frais
const TRADING_FEES = 0.00075; // 0.075%
const TRADE_AMOUNT = 20; // 20 dollars par trade de base

// Fonction pour valider les paramètres
function validateParams(params: TradingAnalysisParams): {
  isValid: boolean;
  error?: string;
} {
  if (!params.crypto || !params.year) {
    return {
      isValid: false,
      error: "Tous les paramètres sont requis: crypto, year",
    };
  }

  const year = parseInt(params.year);
  if (isNaN(year) || year < 2017 || year > new Date().getFullYear()) {
    return {
      isValid: false,
      error:
        "Année invalide. Utilisez une année entre 2017 et l'année actuelle",
    };
  }

  return { isValid: true };
}

// Fonction pour récupérer les données depuis la base de données
async function fetchCryptoData(
  crypto: string,
  year: string,
  cryptoId: number
): Promise<PriceData[]> {
  const supabase = createServer();

  try {
    // Récupérer toutes les entrées de crypto_day_history pour cette crypto et cette année
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: historyData, error: historyError } = await supabase
      .from("crypto_day_history")
      .select("prices_per_minute, date")
      .eq("crypto_id", cryptoId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })
      .not("prices_per_minute", "is", null);

    if (historyError) {
      throw new Error(
        `Erreur lors de la récupération des données historiques: ${historyError.message}`
      );
    }

    if (!historyData || historyData.length === 0) {
      throw new Error(
        `Aucune donnée trouvée pour ${crypto} en ${year}. Veuillez d'abord récupérer les données avec l'API crypto-history-request.`
      );
    }

    // 3. Construire un tableau de prix avec date et index
    const prices: PriceData[] = [];
    for (const dayData of historyData) {
      if (
        dayData.prices_per_minute &&
        Array.isArray(dayData.prices_per_minute)
      ) {
        // Convertir les valeurs en nombres
        const dayPrices = dayData.prices_per_minute.map((price: any) =>
          typeof price === "string" ? parseFloat(price) : price
        );

        // Ajouter chaque prix avec sa date et son index dans la journée
        dayPrices.forEach((price: number, minuteIndex: number) => {
          prices.push({
            price,
            date: dayData.date,
            minuteIndex,
          });
        });
      }
    }

    if (prices.length === 0) {
      throw new Error(
        `Aucun prix trouvé pour ${crypto} en ${year}. Les données peuvent être incomplètes.`
      );
    }

    return prices;
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des données: ${error instanceof Error ? error.message : "Erreur inconnue"}`
    );
  }
}

// Fonction pour analyser les trades avec une stratégie
function analyzeTradesWithStrategy(
  prices: PriceData[],
  dropThreshold: number,
  upThreshold: number,
  startingMultiplier: number,
  multiplier: number
): {
  trades: Trade[];
  dailyStats: Map<string, DailyStats>;
} {
  const trades: Trade[] = [];
  let tradeId = 1;
  let highestPrice = 0;
  let activeTrades: Trade[] = [];
  const dailyStats = new Map<string, DailyStats>();

  // Initialiser les stats par jour
  prices.forEach((priceData) => {
    if (!dailyStats.has(priceData.date)) {
      dailyStats.set(priceData.date, {
        date: priceData.date,
        nb_token: 0,
        max_trade_open: 0,
        total_trade_open: 0,
        count_minutes: 0,
        total_invest: 0,
        max_invest: 0,
        nb_trade_closed: 0,
        nb_trade_open: 0,
        total_profit: 0,
        total_fees: 0,
      });
    }
  });

  for (let i = 0; i < prices.length; i++) {
    const priceData = prices[i];
    const price = priceData.price;
    const currentDate = priceData.date;

    // Mettre à jour le prix le plus haut si nécessaire
    if (price > highestPrice) {
      highestPrice = price;
    }

    // Vérifier si on peut vendre des trades actifs
    const tradesToClose: Trade[] = [];
    const remainingActiveTrades: Trade[] = [];

    for (const trade of activeTrades) {
      const requiredSellPrice = trade.buyPrice * (1 + upThreshold / 100);
      if (price >= requiredSellPrice) {
        // Vendre le trade
        const sellFees = trade.tradeAmount * TRADING_FEES;
        const profit =
          trade.amount * (price - trade.buyPrice) - trade.fees - sellFees;

        trade.sellPrice = price;
        trade.status = "closed";
        trade.profit = profit;
        trade.fees += sellFees;
        trade.sellTimestamp = i;
        tradesToClose.push(trade);

        // Mettre à jour les stats du jour
        const dayStats = dailyStats.get(
          trade.buyTimestamp !== undefined
            ? prices[trade.buyTimestamp].date
            : currentDate
        )!;
        if (dayStats) {
          dayStats.nb_trade_closed++;
          dayStats.total_profit += profit;
          dayStats.total_fees += sellFees;
        }
      } else {
        remainingActiveTrades.push(trade);
      }
    }

    // Fermer les trades vendus
    trades.push(...tradesToClose);
    activeTrades = remainingActiveTrades;

    // Détecter une chute par rapport au prix le plus haut
    if (highestPrice > 0) {
      const dropPercentage = ((highestPrice - price) / highestPrice) * 100;

      if (dropPercentage >= dropThreshold) {
        // Calculer le montant du trade avec multiplicateur régressif
        // Le multiplicateur diminue avec le nombre de trades actifs
        const currentMultiplier =
          startingMultiplier * Math.pow(multiplier, activeTrades.length);
        const tradeAmount = TRADE_AMOUNT * currentMultiplier;

        // Détecter un achat - créer un nouveau trade
        const buyFees = tradeAmount * TRADING_FEES;
        const newTrade: Trade = {
          id: tradeId++,
          buyPrice: price,
          status: "open",
          fees: buyFees,
          amount: tradeAmount / price,
          tradeAmount,
          buyTimestamp: i,
        };

        activeTrades.push(newTrade);

        // Mettre à jour le prix le plus haut pour le prochain trade
        highestPrice = price;
      }
    }

    // Mettre à jour les stats du jour
    const dayStats = dailyStats.get(currentDate)!;
    if (dayStats) {
      dayStats.nb_trade_open = activeTrades.length;
      dayStats.max_trade_open = Math.max(
        dayStats.max_trade_open,
        activeTrades.length
      );
      dayStats.total_trade_open += activeTrades.length;
      dayStats.count_minutes++;

      // Calculer l'investissement total actuel
      const currentInvest = activeTrades.reduce(
        (sum, trade) => sum + trade.tradeAmount,
        0
      );
      dayStats.total_invest += currentInvest;
      dayStats.max_invest = Math.max(dayStats.max_invest, currentInvest);

      // Calculer le nombre de tokens
      const currentTokens = activeTrades.reduce(
        (sum, trade) => sum + trade.amount,
        0
      );
      dayStats.nb_token = currentTokens;
    }
  }

  // Ajouter tous les trades actifs restants
  trades.push(...activeTrades);

  return { trades, dailyStats };
}

// Interface pour les stats quotidiennes
interface DailyStats {
  date: string;
  nb_token: number;
  max_trade_open: number;
  total_trade_open: number;
  count_minutes: number;
  total_invest: number;
  max_invest: number;
  nb_trade_closed: number;
  nb_trade_open: number;
  total_profit: number;
  total_fees: number;
}

// Fonction pour analyser une stratégie spécifique
async function analyzeStrategy(
  strategy: any,
  cryptoId: number,
  year: number,
  prices: PriceData[],
  endingPrice: number
): Promise<StrategyAnalysisResult> {
  const supabase = createServer();

  // Vérifier si un test existe déjà
  console.log(
    `🔍 Vérification du test existant pour stratégie ${strategy.id}, crypto ${cryptoId}, année ${year}...`
  );
  const { data: existingTest, error: testError } = await supabase
    .from("strategy_test")
    .select("*")
    .eq("strategy_id", strategy.id)
    .eq("crypto_id", cryptoId)
    .eq("year", year)
    .single();

  if (testError) {
    if (testError.code === "PGRST116") {
      // PGRST116 = not found, ce qui est OK - on va calculer le test
      console.log(
        `ℹ️ Aucun test existant trouvé pour stratégie ${strategy.id}, calcul nécessaire`
      );
    } else {
      console.error(`❌ Erreur lors de la vérification:`, testError);
      throw new Error(
        `Erreur lors de la vérification du test existant: ${testError.message} (code: ${testError.code})`
      );
    }
  } else if (existingTest) {
    console.log(`✅ Test existant trouvé avec l'ID: ${existingTest.id}`);
  }

  if (existingTest) {
    // Récupérer l'historique quotidien
    const { data: history, error: historyError } = await supabase
      .from("strategy_test_history")
      .select("*")
      .eq("strategy_test_id", existingTest.id)
      .order("date", { ascending: true });

    if (historyError) {
      console.warn(
        `Erreur lors de la récupération de l'historique pour stratégie ${strategy.id}: ${historyError.message}`
      );
    }

    return {
      strategy_id: existingTest.strategy_id,
      crypto_id: existingTest.crypto_id,
      year: existingTest.year,
      starting_price: existingTest.starting_price,
      ending_price: existingTest.ending_price,
      average_price: existingTest.average_price,
      percent: existingTest.percent,
      max_trade_open: existingTest.max_trade_open,
      average_trade_open: existingTest.average_trade_open,
      max_invest: existingTest.max_invest,
      nb_token: existingTest.nb_token,
      fees: existingTest.fees,
      nb_trade_closed: existingTest.nb_trade_closed,
      nb_trade_open: existingTest.nb_trade_open,
      profit: existingTest.profit,
      profit_percent: existingTest.profit_percent,
      dailyHistory:
        history?.map((h) => ({
          date: h.date,
          nb_token: h.nb_token,
          max_trade_open: h.max_trade_open,
          average_trade_open: h.average_trade_open,
          average_price: h.average_price,
          max_invest: h.max_invest,
          nb_trade_closed: h.nb_trade_closed,
          nb_trade_open: h.nb_trade_open,
          profit: h.profit,
          profit_percent: h.profit_percent,
        })) || [],
    };
  }

  // Le test n'existe pas, on doit le calculer
  console.log(
    `🚀 Calcul du test pour stratégie ${strategy.id} (${strategy.name})`
  );

  const startingPrice = prices[0].price;
  const averagePrice =
    prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const percent = ((endingPrice - startingPrice) / startingPrice) * 100;

  // Analyser les trades avec la stratégie
  const { trades, dailyStats } = analyzeTradesWithStrategy(
    prices,
    strategy.percent_per_trade_down,
    strategy.percent_per_trade_up,
    strategy.starting_multiplier,
    strategy.multiplier
  );

  const closedTrades = trades.filter(
    (trade: Trade) => trade.status === "closed"
  );
  const openTrades = trades.filter((trade: Trade) => trade.status === "open");

  const realizedProfit = closedTrades.reduce(
    (sum: number, trade: Trade) => sum + (trade.profit || 0),
    0
  );
  const totalFees = trades.reduce(
    (sum: number, trade: Trade) => sum + trade.fees,
    0
  );
  const unrealizedProfit = openTrades.reduce((total: number, trade: Trade) => {
    const currentValue = trade.amount * (endingPrice - trade.buyPrice);
    return total + currentValue;
  }, 0);
  const totalProfit = realizedProfit + unrealizedProfit;

  const maxSimultaneousTrades = Math.max(
    ...Array.from(dailyStats.values()).map((s: DailyStats) => s.max_trade_open),
    0
  );
  const averageSimultaneousTrades = Math.ceil(
    dailyStats.size > 0
      ? Array.from(dailyStats.values()).reduce(
          (sum: number, s: DailyStats) =>
            sum +
            (s.count_minutes > 0 ? s.total_trade_open / s.count_minutes : 0),
          0
        ) / dailyStats.size
      : 0
  );

  const maxInvest = Math.max(
    ...Array.from(dailyStats.values()).map((s: DailyStats) => s.max_invest),
    0
  );

  const nbToken = openTrades.reduce(
    (sum: number, trade: Trade) => sum + trade.amount,
    0
  );

  const profitPercent = maxInvest > 0 ? (totalProfit / maxInvest) * 100 : 0;

  // Préparer les données pour la sauvegarde
  const strategyTestData = {
    strategy_id: strategy.id,
    crypto_id: cryptoId,
    year,
    starting_price: startingPrice,
    ending_price: endingPrice,
    average_price: averagePrice,
    percent,
    max_trade_open: maxSimultaneousTrades,
    average_trade_open: averageSimultaneousTrades,
    max_invest: maxInvest,
    nb_token: nbToken,
    fees: totalFees,
    nb_trade_closed: closedTrades.length,
    nb_trade_open: openTrades.length,
    profit: totalProfit,
    profit_percent: profitPercent,
  };

  // 7. Vérifier une dernière fois qu'un test n'existe pas déjà (protection contre les doublons)
  const { data: doubleCheckTest } = await supabase
    .from("strategy_test")
    .select("id")
    .eq("strategy_id", strategy.id)
    .eq("crypto_id", cryptoId)
    .eq("year", year)
    .single();

  if (doubleCheckTest) {
    console.log(
      `⚠️ Un test existe déjà pour stratégie ${strategy.id}, récupération au lieu d'insertion`
    );
    // Récupérer le test existant avec son historique
    const { data: history } = await supabase
      .from("strategy_test_history")
      .select("*")
      .eq("strategy_test_id", doubleCheckTest.id)
      .order("date", { ascending: true });

    const { data: existingTestFull } = await supabase
      .from("strategy_test")
      .select("*")
      .eq("id", doubleCheckTest.id)
      .single();

    if (existingTestFull) {
      return {
        strategy_id: existingTestFull.strategy_id,
        crypto_id: existingTestFull.crypto_id,
        year: existingTestFull.year,
        starting_price: existingTestFull.starting_price,
        ending_price: existingTestFull.ending_price,
        average_price: existingTestFull.average_price,
        percent: existingTestFull.percent,
        max_trade_open: existingTestFull.max_trade_open,
        average_trade_open: existingTestFull.average_trade_open,
        max_invest: existingTestFull.max_invest,
        nb_token: existingTestFull.nb_token,
        fees: existingTestFull.fees,
        nb_trade_closed: existingTestFull.nb_trade_closed,
        nb_trade_open: existingTestFull.nb_trade_open,
        profit: existingTestFull.profit,
        profit_percent: existingTestFull.profit_percent,
        dailyHistory:
          history?.map((h) => ({
            date: h.date,
            nb_token: h.nb_token,
            max_trade_open: h.max_trade_open,
            average_trade_open: h.average_trade_open,
            average_price: h.average_price,
            max_invest: h.max_invest,
            nb_trade_closed: h.nb_trade_closed,
            nb_trade_open: h.nb_trade_open,
            profit: h.profit,
            profit_percent: h.profit_percent,
          })) || [],
      };
    }
  }

  // 8. Sauvegarder dans strategy_test (une seule insertion par stratégie)
  console.log(
    `💾 Tentative de sauvegarde du test pour stratégie ${strategy.id} (${strategy.name})...`
  );
  console.log(
    `📝 Données à sauvegarder:`,
    JSON.stringify(strategyTestData, null, 2)
  );

  const { data: savedTest, error: saveError } = await supabase
    .from("strategy_test")
    .insert(strategyTestData)
    .select()
    .single();

  if (saveError) {
    // Si l'erreur est due à une contrainte unique, c'est que la contrainte unique en base
    // ne inclut pas strategy_id, ce qui empêche d'insérer plusieurs stratégies
    if (saveError.code === "23505") {
      // 23505 = unique_violation
      console.warn(
        `⚠️ Violation de contrainte unique détectée pour (year=${year}, crypto_id=${cryptoId}). La contrainte unique ne inclut pas strategy_id, ce qui empêche d'insérer plusieurs stratégies.`
      );

      // Vérifier si un test existe pour cette stratégie spécifique
      const { data: existingForStrategy } = await supabase
        .from("strategy_test")
        .select("*")
        .eq("strategy_id", strategy.id)
        .eq("crypto_id", cryptoId)
        .eq("year", year)
        .maybeSingle();

      if (existingForStrategy) {
        console.log(
          `✅ Test trouvé pour stratégie ${strategy.id} après erreur de contrainte, récupération...`
        );
        const { data: history } = await supabase
          .from("strategy_test_history")
          .select("*")
          .eq("strategy_test_id", existingForStrategy.id)
          .order("date", { ascending: true });

        return {
          strategy_id: existingForStrategy.strategy_id,
          crypto_id: existingForStrategy.crypto_id,
          year: existingForStrategy.year,
          starting_price: existingForStrategy.starting_price,
          ending_price: existingForStrategy.ending_price,
          average_price: existingForStrategy.average_price,
          percent: existingForStrategy.percent,
          max_trade_open: existingForStrategy.max_trade_open,
          average_trade_open: existingForStrategy.average_trade_open,
          max_invest: existingForStrategy.max_invest,
          nb_token: existingForStrategy.nb_token,
          fees: existingForStrategy.fees,
          nb_trade_closed: existingForStrategy.nb_trade_closed,
          nb_trade_open: existingForStrategy.nb_trade_open,
          profit: existingForStrategy.profit,
          profit_percent: existingForStrategy.profit_percent,
          dailyHistory:
            history?.map((h) => ({
              date: h.date,
              nb_token: h.nb_token,
              max_trade_open: h.max_trade_open,
              average_trade_open: h.average_trade_open,
              average_price: h.average_price,
              max_invest: h.max_invest,
              nb_trade_closed: h.nb_trade_closed,
              nb_trade_open: h.nb_trade_open,
              profit: h.profit,
              profit_percent: h.profit_percent,
            })) || [],
        };
      } else {
        // Il existe un test pour (year, crypto_id) mais avec un autre strategy_id
        // C'est un problème de contrainte unique qui doit être corrigé en base
        const { data: existingTest } = await supabase
          .from("strategy_test")
          .select("*")
          .eq("crypto_id", cryptoId)
          .eq("year", year)
          .maybeSingle();

        if (existingTest) {
          console.error(
            `❌ Un test existe déjà pour (year=${year}, crypto_id=${cryptoId}) mais avec strategy_id=${existingTest.strategy_id}, pas ${strategy.id}. La contrainte unique en base de données doit inclure strategy_id.`
          );
          throw new Error(
            `Impossible d'insérer le test : un test existe déjà pour cette crypto/année avec une autre stratégie (strategy_id=${existingTest.strategy_id}). La contrainte unique en base de données doit être modifiée pour inclure strategy_id.`
          );
        }
      }
    }

    console.error(`❌ Erreur de sauvegarde:`, saveError);
    throw new Error(
      `Erreur lors de la sauvegarde du test pour stratégie ${strategy.id}: ${saveError.message || "Erreur inconnue"} (code: ${saveError.code || "N/A"})`
    );
  }

  if (!savedTest) {
    throw new Error(
      `Aucune donnée retournée après l'insertion pour stratégie ${strategy.id}`
    );
  }

  console.log(
    `✅ Test sauvegardé avec l'ID: ${savedTest.id} pour stratégie ${strategy.id}`
  );

  // 9. Préparer et sauvegarder l'historique quotidien (uniquement pour ce test)
  const historyData = Array.from(dailyStats.values()).map(
    (stats: DailyStats) => {
      // Trouver le prix de fin du jour
      const dayEndPrice =
        prices.filter((p: PriceData) => p.date === stats.date).slice(-1)[0]
          ?.price || endingPrice;

      // Calculer le profit du jour (profit réalisé + profit non réalisé)
      // Pour le profit non réalisé, on prend tous les trades ouverts à la fin du jour
      // qui ont été ouverts avant ou pendant ce jour
      const dayEndIndex = prices.findIndex(
        (p: PriceData) => p.date === stats.date && p.minuteIndex === 1439
      );
      const dayEndTimestamp =
        dayEndIndex >= 0 ? dayEndIndex : prices.length - 1;

      // Tous les trades ouverts à la fin du jour (achetés avant ou pendant ce jour)
      const dayOpenTrades = trades.filter(
        (t: Trade) =>
          t.status === "open" &&
          t.buyTimestamp !== undefined &&
          t.buyTimestamp <= dayEndTimestamp
      );
      const dayUnrealizedProfit = dayOpenTrades.reduce(
        (sum: number, trade: Trade) => {
          return sum + trade.amount * (dayEndPrice - trade.buyPrice);
        },
        0
      );
      const dayProfit = stats.total_profit + dayUnrealizedProfit;
      const dayProfitPercent =
        stats.max_invest > 0 ? (dayProfit / stats.max_invest) * 100 : 0;

      // Calculer le prix moyen du jour
      const dayPrices = prices.filter((p: PriceData) => p.date === stats.date);
      const dayAveragePrice =
        dayPrices.reduce((sum: number, p: PriceData) => sum + p.price, 0) /
        dayPrices.length;

      return {
        strategy_test_id: savedTest.id,
        date: stats.date,
        nb_token: stats.nb_token,
        max_trade_open: stats.max_trade_open,
        average_trade_open: Math.ceil(
          stats.count_minutes > 0
            ? stats.total_trade_open / stats.count_minutes
            : 0
        ),
        average_price: dayAveragePrice,
        max_invest: stats.max_invest,
        nb_trade_closed: stats.nb_trade_closed,
        nb_trade_open: stats.nb_trade_open,
        profit: dayProfit,
        profit_percent: dayProfitPercent,
      };
    }
  );

  if (historyData.length > 0) {
    console.log(
      `💾 Sauvegarde de ${historyData.length} jour(s) d'historique pour stratégie ${strategy.id} (test ID: ${savedTest.id})`
    );
    const { error: historySaveError } = await supabase
      .from("strategy_test_history")
      .insert(historyData);

    if (historySaveError) {
      // Si l'erreur est due à une contrainte unique (doublon), on ignore silencieusement
      if (historySaveError.code === "23505") {
        console.warn(
          `⚠️ Historique déjà présent pour stratégie ${strategy.id}, ignoré`
        );
      } else {
        console.warn(
          `Erreur lors de la sauvegarde de l'historique pour stratégie ${strategy.id}: ${historySaveError.message}`
        );
      }
    } else {
      console.log(
        `✅ Historique sauvegardé avec succès pour stratégie ${strategy.id}`
      );
    }
  }

  console.log(`✅ Test calculé et sauvegardé pour stratégie ${strategy.id}`);

  return {
    ...strategyTestData,
    dailyHistory: historyData.map((h) => ({
      date: h.date,
      nb_token: h.nb_token,
      max_trade_open: h.max_trade_open,
      average_trade_open: h.average_trade_open,
      average_price: h.average_price,
      max_invest: h.max_invest,
      nb_trade_closed: h.nb_trade_closed,
      nb_trade_open: h.nb_trade_open,
      profit: h.profit,
      profit_percent: h.profit_percent,
    })),
  };
}

// Fonction principale d'analyse
async function analyzeTradingStrategy(
  params: TradingAnalysisParams
): Promise<TradingAnalysisResponse> {
  const supabase = createServer();
  const year = parseInt(params.year);

  // 1. Récupérer le crypto_id depuis le symbole
  const { data: cryptoData } = await supabase
    .from("crypto")
    .select("id")
    .eq("symbol", params.crypto.toUpperCase())
    .single();

  if (!cryptoData) {
    throw new Error(`Cryptomonnaie "${params.crypto}" non trouvée`);
  }

  const cryptoId = cryptoData.id;

  // 2. Récupérer toutes les stratégies
  const { data: strategies, error: strategiesError } = await supabase
    .from("strategy")
    .select("*")
    .order("id", { ascending: true });

  if (strategiesError || !strategies || strategies.length === 0) {
    throw new Error(
      `Erreur lors de la récupération des stratégies: ${strategiesError?.message || "Aucune stratégie trouvée"}`
    );
  }

  console.log(`📋 ${strategies.length} stratégie(s) trouvée(s)`);

  // 3. Récupérer les données de prix (une seule fois pour toutes les stratégies)
  const prices = await fetchCryptoData(params.crypto, params.year, cryptoId);

  if (!prices || prices.length === 0) {
    throw new Error("Aucune donnée trouvée pour cette période");
  }

  const endingPrice = prices[prices.length - 1].price;
  console.log(`📊 ${prices.length} minutes de données récupérées`);

  // 4. Traiter toutes les stratégies en parallèle pour accélérer les calculs et insertions
  console.log(
    `🚀 Démarrage du traitement parallèle de ${strategies.length} stratégie(s)...`
  );

  const strategyPromises = strategies.map((strategy) =>
    analyzeStrategy(strategy, cryptoId, year, prices, endingPrice)
      .then((result) => {
        console.log(
          `✅ Stratégie ${strategy.id} (${strategy.name}) traitée avec succès`
        );
        return { success: true, result, strategyId: strategy.id };
      })
      .catch((error) => {
        console.error(
          `❌ Erreur lors de l'analyse de la stratégie ${strategy.id} (${strategy.name}):`,
          error instanceof Error ? error.message : error
        );
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
          strategyId: strategy.id,
        };
      })
  );

  // Attendre que toutes les stratégies soient traitées en parallèle
  const strategyResults = await Promise.allSettled(strategyPromises);

  // Extraire les résultats réussis
  const results: StrategyAnalysisResult[] = [];
  for (const settledResult of strategyResults) {
    if (settledResult.status === "fulfilled") {
      const result = settledResult.value;
      if (result.success && "result" in result && result.result) {
        results.push(result.result);
      }
    } else {
      console.error(`❌ Promesse rejetée:`, settledResult.reason);
    }
  }

  console.log(
    `✅ Analyse terminée: ${results.length} résultat(s) retourné(s) sur ${strategies.length} stratégie(s)`
  );

  if (results.length === 0) {
    console.warn(
      `⚠️ Aucun résultat retourné. Vérifiez les logs ci-dessus pour les erreurs.`
    );
  }

  return {
    crypto: params.crypto,
    year,
    results,
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Route crypto-trading-analysis appelée");
    const { searchParams } = new URL(request.url);

    const params: TradingAnalysisParams = {
      crypto: searchParams.get("crypto") || "",
      year: searchParams.get("year") || "",
    };

    console.log(
      `📥 Paramètres reçus: crypto=${params.crypto}, year=${params.year}`
    );

    // Valider les paramètres
    const validation = validateParams(params);
    if (!validation.isValid) {
      console.error(`❌ Validation échouée: ${validation.error}`);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    console.log("✅ Validation réussie, début de l'analyse...");

    // Analyser la stratégie de trading
    const analysis = await analyzeTradingStrategy(params);

    console.log(
      `✅ Analyse terminée, retour de ${analysis.results.length} résultat(s)`
    );

    return NextResponse.json({
      success: true,
      message: "Analyse de stratégie de trading terminée",
      data: analysis,
    });
  } catch (error) {
    console.error("Erreur dans la route crypto-trading-analysis:", error);

    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
