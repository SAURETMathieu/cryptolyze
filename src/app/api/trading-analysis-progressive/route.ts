import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

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
  threshold?: number;
}

// Types pour les résultats d'analyse par seuil
interface ThresholdAnalysis {
  threshold: number;
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  realizedProfit: number;
  unrealizedProfit: number;
  totalProfit: number;
  totalFees: number;
  dropCount: number;
  maxSimultaneousTrades: number;
  averageSimultaneousTrades: number;
  simultaneousTradesDistribution?: {
    count: number;
    frequency: number;
    percentage: number;
  }[];
  profitPercentage: number;
  betOptimization: {
    recommendedBetMultiplier: number;
    highActivityThreshold: number;
    lowActivityThreshold: number;
    explanation: string;
    // activityRanges?: {
    //   range: string;
    //   percentage: number;
    //   recommendedMultiplier: number;
    //   explanation: string;
    // }[];
  };
  trades?: Trade[];
}

// Types pour les résultats d'analyse
interface TradingAnalysisResult {
  crypto: string;
  year: string;
  maxTrades: number;
  remainingTrades: number;
  overallStats: {
    totalTrades: number;
    closedTrades: number;
    openTrades: number;
    totalProfit: number;
    totalFees: number;
    realizedProfit: number;
    unrealizedProfit: number;
    maxSimultaneousTrades: number;
  };
  thresholdAnalyses: ThresholdAnalysis[];
}

// Seuils de chute à analyser
const DROP_THRESHOLDS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 7.5, 10];

// Configuration des frais
const TRADING_FEES = 0.00075; // 0.075%
const TRADE_AMOUNT = 20; // 20 dollars par trade

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

// Fonction pour récupérer les données depuis le dossier data
async function fetchCryptoData(crypto: string, year: string) {
  const dataDir = join(process.cwd(), "data");

  try {
    // Lister tous les fichiers dans le dossier data
    const files = await readdir(dataDir);

    // Chercher le fichier correspondant à la crypto et l'année
    const targetFile = files.find((file) =>
      file.startsWith(`${crypto}_1m_${year}-01-01_${year}-12-31.json`)
    );

    if (!targetFile) {
      throw new Error(
        `Aucun fichier trouvé pour ${crypto} en ${year}. Veuillez d'abord récupérer les données avec l'API crypto-history.`
      );
    }

    // Lire le fichier
    const filePath = join(dataDir, targetFile);
    const fileContent = await readFile(filePath, "utf-8");
    const { data } = JSON.parse(fileContent);

    return data;
  } catch (error) {
    throw new Error(`Erreur lors de la lecture des données: ${error}`);
  }
}

// Fonction pour analyser les trades pour un seuil de chute donné
function analyzeTradesForThreshold(
  prices: any[],
  threshold: number
): {
  trades: Trade[];
  dropCount: number;
  maxSimultaneousTrades: number;
  averageSimultaneousTrades: number;
  simultaneousTradesDistribution: {
    count: number;
    frequency: number;
    percentage: number;
  }[];
} {
  const trades: Trade[] = [];
  let tradeId = 1;
  let highestPrice = 0;
  let activeTrades: Trade[] = []; // Liste des trades actifs
  let dropCount = 0;
  let maxSimultaneousTrades = 0;
  let totalSimultaneousTrades = 0;
  let simultaneousTradesCounts: { [key: number]: number } = {};

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];

    // Mettre à jour le prix le plus haut si nécessaire
    if (price > highestPrice) {
      highestPrice = price;
    }

    // Vérifier si on peut vendre des trades actifs
    const tradesToClose: Trade[] = [];
    const remainingActiveTrades: Trade[] = [];

    for (const trade of activeTrades) {
      const requiredSellPrice = trade.buyPrice * (1 + threshold / 100);
      if (price >= requiredSellPrice) {
        // Vendre le trade
        const sellFees = TRADE_AMOUNT * TRADING_FEES; // Frais sur le montant du trade
        const profit =
          trade.amount * (price - trade.buyPrice) - trade.fees - sellFees;

        trade.sellPrice = price;
        trade.status = "closed";
        trade.profit = profit;
        trade.fees += sellFees;
        tradesToClose.push(trade);
      } else {
        remainingActiveTrades.push(trade);
      }
    }

    // Fermer les trades vendus
    trades.push(...tradesToClose);
    activeTrades = remainingActiveTrades;

    // Compter les trades simultanés actuels
    const currentSimultaneousTrades = activeTrades.length;
    totalSimultaneousTrades += currentSimultaneousTrades;
    simultaneousTradesCounts[currentSimultaneousTrades] =
      (simultaneousTradesCounts[currentSimultaneousTrades] || 0) + 1;

    // Mettre à jour le nombre maximum de trades simultanés
    maxSimultaneousTrades = Math.max(
      maxSimultaneousTrades,
      currentSimultaneousTrades
    );

    // Détecter une chute par rapport au prix le plus haut
    if (highestPrice > 0) {
      const dropPercentage = ((highestPrice - price) / highestPrice) * 100;

      if (dropPercentage >= threshold) {
        // Détecter un achat - créer un nouveau trade
        const buyFees = TRADE_AMOUNT * TRADING_FEES; // Frais sur le montant du trade
        const newTrade: Trade = {
          id: tradeId++,
          buyPrice: price,
          status: "open",
          fees: buyFees,
          amount: TRADE_AMOUNT / price,
          threshold,
        };

        activeTrades.push(newTrade);
        dropCount++;

        // Mettre à jour le prix le plus haut pour le prochain trade
        highestPrice = price;
      }
    }
  }

  // Ajouter tous les trades actifs restants
  trades.push(...activeTrades);

  // Calculer la moyenne des trades simultanés
  const averageSimultaneousTrades =
    prices.length > 0 ? totalSimultaneousTrades / prices.length : 0;

  // Créer la distribution des trades simultanés
  const simultaneousTradesDistribution = Object.entries(
    simultaneousTradesCounts
  )
    .map(([count, frequency]) => ({
      count: parseInt(count),
      frequency,
      percentage: (frequency / prices.length) * 100,
    }))
    .sort((a, b) => a.count - b.count);

  return {
    trades,
    dropCount,
    maxSimultaneousTrades,
    averageSimultaneousTrades,
    simultaneousTradesDistribution,
  };
}

// Fonction pour calculer les profits non réalisés
function calculateUnrealizedProfit(
  trades: Trade[],
  currentPrice: number
): number {
  return trades
    .filter((trade) => trade.status === "open")
    .reduce((total, trade) => {
      // Calculer la valeur actuelle du trade de 20$
      const currentValue = trade.amount * (currentPrice - trade.buyPrice);
      return total + currentValue;
    }, 0);
}

// Fonction pour calculer les recommandations d'optimisation des mises
function calculateBetOptimization(
  distribution: { count: number; frequency: number; percentage: number }[]
): {
  recommendedBetMultiplier: number;
  highActivityThreshold: number;
  lowActivityThreshold: number;
  explanation: string;
  // activityRanges: {
  //   range: string;
  //   percentage: number;
  //   recommendedMultiplier: number;
  //   explanation: string;
  // }[];
} {
  if (distribution.length === 0) {
    return {
      recommendedBetMultiplier: 1,
      highActivityThreshold: 0,
      lowActivityThreshold: 0,
      explanation: "Distribution vide - Mises normales recommandées.",
      // activityRanges: [],
    };
  }

  // Normaliser les pourcentages pour garantir que la somme fait 100%
  const totalPercentage = distribution.reduce(
    (sum, d) => sum + d.percentage,
    0
  );
  const normalizedDistribution = distribution.map((d) => ({
    ...d,
    normalizedPercentage: (d.percentage / totalPercentage) * 100,
  }));

  const sorted = [...normalizedDistribution].sort((a, b) => a.count - b.count);

  // Calcul cumulatif
  let cumulative = 0;
  const cumulativeDistribution = sorted.map((d) => {
    cumulative += d.normalizedPercentage;
    return { ...d, cumulative };
  });

  const activityRanges = cumulativeDistribution.map((d) => {
    let recommendedMultiplier: number;
    let explanation: string;

    if (d.cumulative <= 60) {
      recommendedMultiplier = 1;
      explanation = "Activité normale";
    } else if (d.cumulative <= 90) {
      recommendedMultiplier = 1.25;
      explanation = "Activité légèrement augmentée";
    } else if (d.cumulative <= 97) {
      recommendedMultiplier = 1.5;
      explanation = "Activité rare";
    } else {
      recommendedMultiplier = 2;
      explanation = "Activité très rare";
    }

    return {
      range: `${d.count} trade${d.count > 1 ? "s" : ""}`,
      percentage: d.normalizedPercentage,
      recommendedMultiplier,
      explanation,
    };
  });

  // Calcul pondéré
  const weightedMultiplier = activityRanges.reduce(
    (acc, r) => acc + r.recommendedMultiplier * (r.percentage / 100),
    0
  );

  // Regroupement des pourcentages
  const lowActivityPercentage = activityRanges
    .filter((r) => r.recommendedMultiplier === 1)
    .reduce((acc, r) => acc + r.percentage, 0);

  const mediumActivityPercentage = activityRanges
    .filter((r) => r.recommendedMultiplier === 1.25)
    .reduce((acc, r) => acc + r.percentage, 0);

  const highActivityPercentage = activityRanges
    .filter((r) => r.recommendedMultiplier === 1.5)
    .reduce((acc, r) => acc + r.percentage, 0);

  const veryHighActivityPercentage = activityRanges
    .filter((r) => r.recommendedMultiplier === 2)
    .reduce((acc, r) => acc + r.percentage, 0);

  const explanation = `Analyse de l'activité :
- Activité normale : ${lowActivityPercentage.toFixed(1)}%
- Activité légèrement augmentée : ${mediumActivityPercentage.toFixed(1)}%
- Activité rare : ${highActivityPercentage.toFixed(1)}%
- Activité très rare : ${veryHighActivityPercentage.toFixed(1)}%
Recommandation globale basée sur ces proportions.`;

  return {
    recommendedBetMultiplier: Math.round(weightedMultiplier * 100) / 100,
    highActivityThreshold: highActivityPercentage,
    lowActivityThreshold: lowActivityPercentage,
    explanation,
    // activityRanges,
  };
}

// Fonction principale d'analyse
async function analyzeTradingStrategy(
  params: TradingAnalysisParams
): Promise<TradingAnalysisResult> {
  // Récupérer les données historiques depuis le dossier data
  const priceData = await fetchCryptoData(params.crypto, params.year);

  if (!priceData || priceData.length === 0) {
    throw new Error("Aucune donnée trouvée pour cette période");
  }

  const currentPrice = priceData[priceData.length - 1];

  console.log(`🚀 Début de l'analyse pour ${params.crypto} ${params.year}`);
  console.log(`📊 Nombre de minutes analysés: ${priceData.length}`);
  console.log(`💰 Prix actuel: ${currentPrice}`);

  // Analyser tous les seuils en parallèle avec Promise.all
  const analysisPromises = DROP_THRESHOLDS.map(async (threshold) => {
    console.log(`📈 Analyse du seuil ${threshold}%...`);
    const result = analyzeTradesForThreshold(priceData, threshold);

    // Calculer les métriques pour ce seuil
    const closedTrades = result.trades.filter(
      (trade) => trade.status === "closed"
    );
    const openTrades = result.trades.filter((trade) => trade.status === "open");

    const realizedProfit = closedTrades.reduce(
      (sum, trade) => sum + (trade.profit || 0),
      0
    );
    const totalFees = result.trades.reduce((sum, trade) => sum + trade.fees, 0);
    const unrealizedProfit = calculateUnrealizedProfit(
      openTrades,
      currentPrice
    );
    const totalProfit = realizedProfit + unrealizedProfit;
    const profitPercentage =
      result.maxSimultaneousTrades > 0
        ? (totalProfit / (result.maxSimultaneousTrades * TRADE_AMOUNT)) * 100
        : 0;

    // Calculer les recommandations d'optimisation
    const betOptimization = calculateBetOptimization(
      result.simultaneousTradesDistribution
    );

    return {
      threshold,
      totalTrades: result.trades.length,
      closedTrades: closedTrades.length,
      openTrades: openTrades.length,
      realizedProfit,
      unrealizedProfit,
      totalProfit,
      totalFees,
      dropCount: result.dropCount,
      maxSimultaneousTrades: result.maxSimultaneousTrades,
      averageSimultaneousTrades: result.averageSimultaneousTrades,
      // simultaneousTradesDistribution: result.simultaneousTradesDistribution,
      // trades: result.trades,
      profitPercentage,
      betOptimization,
    };
  });

  // Exécuter toutes les analyses en parallèle
  const thresholdAnalyses = await Promise.all(analysisPromises);

  console.log(`✅ Analyse de tous les seuils terminée`);

  const totalProfit = thresholdAnalyses.reduce(
    (sum, analysis) => sum + analysis.totalProfit,
    0
  );

  const realizedProfit = thresholdAnalyses.reduce(
    (sum, analysis) => sum + analysis.realizedProfit,
    0
  );

  const totalFees = thresholdAnalyses.reduce(
    (sum, analysis) => sum + analysis.totalFees,
    0
  );

  const unrealizedProfit = thresholdAnalyses.reduce(
    (sum, analysis) => sum + analysis.unrealizedProfit,
    0
  );

  const maxSimultaneousTrades = thresholdAnalyses.reduce(
    (sum, analysis) => sum + analysis.maxSimultaneousTrades,
    0
  );

  // Calculer les statistiques globales
  const overallStats = {
    totalTrades: thresholdAnalyses.reduce(
      (sum, analysis) => sum + analysis.totalTrades,
      0
    ),
    closedTrades: thresholdAnalyses.reduce(
      (sum, analysis) => sum + analysis.closedTrades,
      0
    ),
    openTrades: thresholdAnalyses.reduce(
      (sum, analysis) => sum + analysis.openTrades,
      0
    ),
    totalProfit,
    totalFees,
    realizedProfit,
    unrealizedProfit,
    maxSimultaneousTrades,
  };

  // Calculer le nombre maximum de trades possibles (basé sur 20$ par trade)
  const maxTrades = Math.floor(1000 / TRADE_AMOUNT); // 1000$ / 20$ = 50 trades
  const remainingTrades = maxTrades - overallStats.totalTrades;

  console.log(`📊 Résultats finaux:`);
  console.log(`  - Trades totaux: ${overallStats.totalTrades}`);
  console.log(`  - Trades fermés: ${overallStats.closedTrades}`);
  console.log(`  - Trades ouverts: ${overallStats.openTrades}`);
  console.log(`  - Profit réalisé: ${overallStats.realizedProfit.toFixed(2)}$`);
  console.log(`  - Frais totaux: ${overallStats.totalFees.toFixed(2)}$`);

  // Afficher les résultats par seuil
  console.log(`📈 Résultats par seuil:`);
  thresholdAnalyses.forEach((analysis) => {
    console.log(
      `  - ${analysis.threshold}%: ${analysis.totalTrades} trades, ${analysis.realizedProfit.toFixed(2)}$ profit, ${analysis.averageSimultaneousTrades.toFixed(2)} trades simultanés en moyenne`
    );
  });

  return {
    crypto: params.crypto,
    year: params.year,
    maxTrades,
    remainingTrades: Math.max(0, remainingTrades),
    overallStats,
    thresholdAnalyses,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: TradingAnalysisParams = {
      crypto: searchParams.get("crypto") || "",
      year: searchParams.get("year") || "",
    };

    // Valider les paramètres
    const validation = validateParams(params);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Analyser la stratégie de trading
    const analysis = await analyzeTradingStrategy(params);

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
