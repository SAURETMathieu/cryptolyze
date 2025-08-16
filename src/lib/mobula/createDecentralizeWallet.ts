"server-only";

import { getAllTransactions } from "@/src/lib/mobula/getTransactions";
import { getWalletTokenBalancesWithMobula } from "@/src/lib/mobula/getWalletTokenBalancesWithMobula";
import { createWalletWithBalancesAndTransactions } from "@/src/lib/mobula/initializeWallet";

export async function createDecentralizeWalletWithMobula(
  body: any & { type: "decentralized" }
) {
  const walletTokensBalances = await getWalletTokenBalancesWithMobula(
    body.address,
    body.blockchain
  );

  if (!walletTokensBalances || walletTokensBalances.error) {
    throw new Error(walletTokensBalances.error);
  }

  const transactions = await getAllTransactions(body.address, body.blockchain);

  if (!transactions) {
    throw new Error("Error while fetching data, try again later");
  }

  const newWallet = await createWalletWithBalancesAndTransactions(
    body,
    walletTokensBalances,
    transactions
  );
  return newWallet;
}
