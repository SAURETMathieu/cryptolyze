"server-only";

import { createServer } from "@/src/lib/supabase/server";

export async function getWalletsWithBalancesAndTransactions(
  userId: string,
  walletId?: number
): Promise<any[]> {
  const supabase = createServer();

  try {
    // Récupérer les wallets
    let walletQuery = supabase
      .from("wallet")
      .select("*")
      .eq("profile_id", userId);

    if (walletId) {
      walletQuery = walletQuery.eq("id", walletId);
    }

    const { data: wallets, error: walletError } = await walletQuery;

    if (walletError) {
      throw new Error(
        `Erreur lors de la récupération des wallets: ${walletError.message}`
      );
    }

    if (!wallets || wallets.length === 0) {
      return [];
    }

    // Pour chaque wallet, récupérer les balances et transactions
    const walletsWithBalances = await Promise.all(
      wallets.map(async (wallet) => {
        // Récupérer les balances pour ce wallet
        const { data: balances, error: balanceError } = await supabase
          .from("wallet_cryptos")
          .select(
            `
            *,
            crypto:crypto_id (
              id,
              symbol,
              name,
              digit,
              logo_url,
              currency
            )
          `
          )
          .eq("wallet_id", wallet.id);

        if (balanceError) {
          console.error(
            `Erreur lors de la récupération des balances pour le wallet ${wallet.id}:`,
            balanceError
          );
        }

        // Récupérer les transactions pour ce wallet
        const { data: transactions, error: transactionError } = await supabase
          .from("transaction")
          .select("*")
          .eq("wallet_id", wallet.id);

        if (transactionError) {
          console.error(
            `Erreur lors de la récupération des transactions pour le wallet ${wallet.id}:`,
            transactionError
          );
        }

        // Formater les balances avec les transactions
        const formattedBalances = (balances || []).map((balance) => {
          const crypto = balance.crypto;
          const walletTransactions = (transactions || []).filter(
            (tx) => tx.crypto_id === balance.crypto_id
          );

          return {
            id: balance.wallet_id, // Utiliser wallet_id comme ID temporaire
            symbol: crypto?.symbol || "",
            cryptoId: balance.crypto_id,
            cryptoName: crypto?.name || "",
            digit: crypto?.digit || 0,
            logo_url: crypto?.logo_url || "",
            currency: crypto?.currency || "USDT",
            nbToken: balance.nb_token,
            price: balance.price,
            price1h: null, // À implémenter si nécessaire
            price24h: balance.price24h,
            timestamp: balance.updated_at || new Date().toISOString(),
            percent: balance.percent,
            realizedProfit: null, // À calculer selon votre logique métier
            unrealizedProfit: null, // À calculer selon votre logique métier
            balanceUsd: balance.nb_token * (balance.price || 0),
            transactions: walletTransactions.map((tx) => ({
              id: tx.id,
              idx: tx.id.toString(), // Utiliser l'ID comme idx temporaire
              cryptoId: tx.crypto_id,
              walletId: tx.wallet_id,
              fromAddress: tx.from_address || "",
              toAddress: tx.to_address || "",
              fromLabel: tx.from_label,
              toLabel: tx.to_label,
              fees: tx.fees,
              value: tx.value || 0, // Valeur par défaut si null
              status: tx.status?.toString() || "confirmed",
              type: tx.type || "transfer",
              timestamp: tx.timestamp || tx.created_at,
              price: tx.price,
              blockNumber: null, // Propriété non disponible dans la table transaction
            })),
          };
        });

        return {
          ...wallet,
          balances: formattedBalances,
        };
      })
    );

    return walletsWithBalances;
  } catch (error) {
    console.error("Erreur dans getWalletsWithBalancesAndTransactions:", error);
    throw error;
  }
}
