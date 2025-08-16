"server-only";

import { createServer } from "@/src/lib/supabase/server";

export async function createWalletWithBalancesAndTransactions(
  walletData: any,
  walletTokensBalances: any,
  transactions: any
) {
  const supabase = createServer();
  let createdWallet;
  let createdBalances: any[] = [];
  let createdTransactions: any[] = [];

  try {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    let lastTransationTimestamp =
      transactions[transactions.length - 1]?.timestamp;
    if (!iso8601Regex.test(lastTransationTimestamp)) {
      lastTransationTimestamp = new Date();
    } else {
      lastTransationTimestamp = new Date(
        transactions[transactions.length - 1]?.timestamp
      );
    }
    lastTransationTimestamp.setSeconds(
      lastTransationTimestamp.getSeconds() + 1
    );
    const newIsoDate = lastTransationTimestamp.toISOString();
    walletData.lastTransaction = newIsoDate;

    createdWallet = await supabase
      .from("wallet")
      .insert(walletData)
      .select()
      .single();

    const cryptoCache: { [symbol: string]: any } = {};

    for (const tokenBalance of walletTokensBalances) {
      let crypto = cryptoCache[tokenBalance.symbol];

      if (!crypto) {
        crypto = await supabase
          .from("crypto")
          .select()
          .eq("asset", tokenBalance.symbol)
          .single();

        if (!crypto) {
          crypto = await supabase
            .from("crypto")
            .insert({
              asset: tokenBalance.symbol,
              name: tokenBalance.name,
              digit: tokenBalance.decimals,
              logo_url: tokenBalance.logo,
            })
            .select()
            .single();
        }

        cryptoCache[tokenBalance.symbol] = crypto;
      }

      const balance = await supabase
        .from("balance_history")
        .insert({
          wallet_id: createdWallet.data?.id!,
          crypto_id: crypto.data?.id!,
          nb_token: tokenBalance.balance ?? 0,
          price: tokenBalance.usdPrice ?? null,
          price_1h: tokenBalance.usdPrice1h ?? null,
          price_24h: tokenBalance.usdPrice24h ?? null,
          percent: tokenBalance.portfolioPercentage ?? 0,
          timestamp: new Date().toISOString(),
          realized_profit: tokenBalance.realizedProfit ?? null,
          unrealized_profit: tokenBalance.unrealizedProfit ?? null,
        })
        .select()
        .single();

      createdBalances.push(balance);
    }

    for (const transaction of transactions) {
      let crypto = cryptoCache[transaction.tokenSymbol];

      if (!crypto) {
        crypto = await supabase
          .from("crypto")
          .select()
          .eq("asset", transaction.tokenSymbol)
          .single();

        if (!crypto) {
          crypto = await supabase
            .from("crypto")
            .insert({
              asset: transaction.tokenSymbol,
              name: transaction.tokenName,
              digit: transaction.tokenDecimals,
              logo_url: transaction.tokenLogo,
            })
            .select()
            .single();
        }

        cryptoCache[transaction.tokenSymbol] = crypto;
      }

      const createdTransaction = await supabase
        .from("transaction")
        .insert({
          idx: transaction.idx,
          from_address: transaction.fromAddress,
          to_address: transaction.toAddress,
          from_label: transaction.fromLabel,
          to_label: transaction.toLabel,
          fees: transaction.fees ?? 0,
          value: transaction.value ?? 0,
          status: transaction.status,
          type: transaction.type,
          timestamp: transaction.timestamp,
          block_number: transaction.blockNumber,
          price: transaction.tokenPrice ?? 0,
          crypto_id: crypto.data?.id!,
          wallet_id: createdWallet.data?.id!,
        })
        .select()
        .single();

      createdTransactions.push(createdTransaction);
    }

    return createdWallet;
  } catch (error) {
    console.error(
      "Error creating wallet with balances and transactions:",
      error
    );
    throw error;
  }
}
