import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

// Types pour les paramètres de requête
interface CryptoHistoryParams {
  crypto: string;
  interval: string;
  startDate: string;
  endDate: string;
}

// Configuration du rate limit Binance
const BINANCE_RATE_LIMITS = {
  REQUEST_WEIGHT_PER_IP: 6000,
  REQUESTS_PER_SECOND: 20,
  WEIGHT_PER_REQUEST: 2, // Pour une requête avec limit=1000
  DELAY_BETWEEN_REQUESTS: 60, // 60ms entre les requêtes pour respecter 20 req/sec
};

// Intervalles disponibles sur l'API Binance
const VALID_INTERVALS = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
];

// Fonction pour valider les paramètres
function validateParams(params: CryptoHistoryParams): {
  isValid: boolean;
  error?: string;
} {
  if (
    !params.crypto ||
    !params.interval ||
    !params.startDate ||
    !params.endDate
  ) {
    return {
      isValid: false,
      error:
        "Tous les paramètres sont requis: crypto, interval, startDate, endDate",
    };
  }

  if (!VALID_INTERVALS.includes(params.interval)) {
    return {
      isValid: false,
      error: `Interval invalide. Intervalles valides: ${VALID_INTERVALS.join(", ")}`,
    };
  }

  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      isValid: false,
      error: "Format de date invalide. Utilisez YYYY-MM-DD",
    };
  }

  if (startDate >= endDate) {
    return {
      isValid: false,
      error: "La date de début doit être antérieure à la date de fin",
    };
  }

  return { isValid: true };
}

// Fonction pour calculer les intervalles de temps en millisecondes selon l'interval
function getIntervalInMs(interval: string): number {
  const intervalMap: { [key: string]: number } = {
    "1m": 60 * 1000,
    "3m": 3 * 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "2h": 2 * 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "8h": 8 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "3d": 3 * 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000, // Approximation pour 1 mois
  };
  return intervalMap[interval] || 60 * 1000; // Par défaut 1 minute
}

// Fonction pour attendre un délai
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fonction pour récupérer une page de données depuis l'API Binance avec gestion du rate limit
async function fetchCryptoHistoryPage(
  symbol: string,
  interval: string,
  startTime: number,
  endTime: number,
  limit: number = 1000
) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`;

  try {
    const response = await fetch(url);

    // Logger les headers de poids de l'API Binance
    const usedWeightHeaders: string[] = [];
    Array.from(response.headers.entries()).forEach(([key, value]) => {
      if (key.startsWith("x-mbx-used-weight")) {
        usedWeightHeaders.push(`${key}: ${value}`);
      }
    });

    if (usedWeightHeaders.length > 0) {
      console.log(
        `📊 Headers de poids pour ${symbol} ${interval}:`,
        usedWeightHeaders
      );
    } else {
      console.log(
        `⚠️  Aucun header de poids trouvé pour ${symbol} ${interval}`
      );
    }

    if (!response.ok) {
      // Vérifier si c'est une erreur de rate limit
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(
          `🚨 Rate limit atteint pour ${symbol} ${interval}, attente de ${waitTime}ms`
        );
        await delay(waitTime);
        // Réessayer une fois
        const retryResponse = await fetch(url);

        // Logger les headers de la requête de retry
        const retryUsedWeightHeaders: string[] = [];
        Array.from(retryResponse.headers.entries()).forEach(([key, value]) => {
          if (key.startsWith("x-mbx-used-weight")) {
            retryUsedWeightHeaders.push(`${key}: ${value}`);
          }
        });

        if (retryUsedWeightHeaders.length > 0) {
          console.log(
            `📊 Headers de poids (retry) pour ${symbol} ${interval}:`,
            retryUsedWeightHeaders
          );
        }

        if (!retryResponse.ok) {
          throw new Error(
            `Erreur API Binance après retry: ${retryResponse.status} ${retryResponse.statusText}`
          );
        }
        return await retryResponse.json();
      }

      throw new Error(
        `Erreur API Binance: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des données: ${error}`);
  }
}

// Fonction pour récupérer l'historique complet avec pagination et gestion du rate limit
async function fetchCryptoHistory(params: CryptoHistoryParams) {
  const symbol = `${params.crypto}USDT`;
  const startTime = new Date(params.startDate).getTime();
  const endTime = new Date(params.endDate).getTime();
  const intervalMs = getIntervalInMs(params.interval);

  // Calculer le nombre total de périodes
  const totalPeriods = Math.ceil((endTime - startTime) / intervalMs);

  console.log(`🚀 Début de la récupération pour ${symbol} ${params.interval}`);
  console.log(`📅 Période: ${params.startDate} à ${params.endDate}`);
  console.log(`📊 Nombre total de périodes: ${totalPeriods}`);

  // Si moins de 1000 périodes, une seule requête suffit
  if (totalPeriods <= 1000) {
    const data = await fetchCryptoHistoryPage(
      symbol,
      params.interval,
      startTime,
      endTime
    );
    return formatCryptoData(data, params);
  }

  // Sinon, diviser en plusieurs requêtes avec gestion du rate limit
  const requests: Promise<any[]>[] = [];
  let currentStartTime = startTime;
  const limit = 1000;
  let requestCount = 0;

  while (currentStartTime < endTime) {
    const currentEndTime = Math.min(
      currentStartTime + limit * intervalMs,
      endTime
    );

    // Ajouter un délai entre les requêtes pour respecter le rate limit
    if (requestCount > 0) {
      await delay(BINANCE_RATE_LIMITS.DELAY_BETWEEN_REQUESTS);
    }

    requests.push(
      fetchCryptoHistoryPage(
        symbol,
        params.interval,
        currentStartTime,
        currentEndTime,
        limit
      )
    );

    currentStartTime = currentEndTime;
    requestCount++;
  }

  console.log(`🔄 Exécution de ${requests.length} requêtes avec délais...`);

  // Exécuter les requêtes avec des délais pour respecter le rate limit
  const results: any[][] = [];
  for (let i = 0; i < requests.length; i++) {
    try {
      console.log(`📡 Requête ${i + 1}/${requests.length}...`);
      const result = await requests[i];
      results.push(result);

      // Ajouter un délai entre les requêtes (sauf pour la dernière)
      if (i < requests.length - 1) {
        await delay(BINANCE_RATE_LIMITS.DELAY_BETWEEN_REQUESTS);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la requête ${i + 1}:`, error);
      throw error;
    }
  }

  // Combiner et trier toutes les données
  const allData = results.flat();

  // Supprimer les doublons (au cas où il y en aurait)
  const uniqueData = allData.filter(
    (item, index, self) => index === 0 || item[0] !== self[index - 1][0]
  );

  console.log(
    `✅ Récupération terminée: ${uniqueData.length} enregistrements uniques`
  );

  return formatCryptoData(uniqueData, params);
}

// Fonction pour formater les données de crypto
function formatCryptoData(data: any[], params: CryptoHistoryParams) {
  // Transformer les données en format plus lisible
  const formattedData = data.map((candle: any[]) => {
    return parseFloat(candle[4]);
  });

  return {
    symbol: `${params.crypto}USDT`,
    interval: params.interval,
    startDate: params.startDate,
    endDate: params.endDate,
    data: formattedData,
    count: formattedData.length,
  };
}

// Fonction pour enregistrer les données dans un fichier
async function saveToFile(data: any, params: CryptoHistoryParams) {
  const fileName = `${params.crypto}_${params.interval}_${params.startDate}_${params.endDate}.json`;

  // Créer le dossier data s'il n'existe pas
  const dataDir = join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });

  const filePath = join(dataDir, fileName);

  const fileContent = {
    metadata: {
      crypto: params.crypto,
      interval: params.interval,
      startDate: params.startDate,
      endDate: params.endDate,
      generatedAt: new Date().toISOString(),
      totalRecords: data.count,
    },
    data: data.data,
  };

  await writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: CryptoHistoryParams = {
      crypto: searchParams.get("crypto") || "",
      interval: searchParams.get("interval") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    };

    // Valider les paramètres
    const validation = validateParams(params);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Récupérer les données depuis l'API Binance avec pagination et gestion du rate limit
    const cryptoData = await fetchCryptoHistory(params);

    // Enregistrer dans un fichier
    await saveToFile(cryptoData, params);

    return NextResponse.json({
      success: true,
      message: "Données récupérées et enregistrées avec succès",
      data: cryptoData,
    });
  } catch (error) {
    console.error("Erreur dans la route crypto-history:", error);

    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
