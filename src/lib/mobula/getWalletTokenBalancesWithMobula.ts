"server-only";

// cost 2 per request => 5000 per month max
// per day max 166

export async function getWalletTokenBalancesWithMobula(
  walletAddress: string,
  blockchain: string
) {
  try {
    const apiKey = process.env.MOBULA_KEY as string;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };
    if (blockchain === "BSC") blockchain = "BNB";
    const res = await fetch(
      `https://api.mobula.io/api/1/wallet/portfolio?wallet=${walletAddress}&blockchains=${blockchain}`,
      options
    );

    const { data, error } = await res.json();

    if (!data || !res.ok || error) {
      return { error: error || "Error while fetching data, try again later" };
    }

    const formattedData = data?.assets?.map((asset: any) => {
      const assetInfo = asset.asset ?? {};
      const contractsBalances = asset.contracts_balances?.[0] ?? {};
      return {
        name: assetInfo.name ?? "Unknown Name",
        symbol: assetInfo.symbol ?? "????",
        logo: assetInfo.logo ?? "/empty-token.svg",
        decimals: contractsBalances.decimals ?? 18,
        usdPrice: asset.price ?? 0,
        usdPrice1h: asset.price_change_1h ?? 0,
        usdPrice24h: asset.price_change_24h ?? 0,
        totalInvested: asset.total_invested ?? 0,
        portfolioPercentage: asset.allocation ?? 0,
        balance: asset.token_balance ?? 0,
        usdBalance: asset.estimated_balance ?? 0,
        realizedProfit: asset.realized_pnl ?? 0,
        unrealizedProfit: asset.unrealized_pnl ?? 0,
      };
    });

    return formattedData;
  } catch (error: any) {
    console.error(error);
    return { error: error };
  }
}
