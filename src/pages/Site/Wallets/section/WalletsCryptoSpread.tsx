"use client";

import { PieChartGraph } from "@/src/components/charts/PieChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useWalletsStore } from "@/src/store/wallet.store";
import { aggregateBalances } from "@/utils/aggregateBalances";

export function WalletCryptoSpread() {
  const wallets = useWalletsStore((state) => state.wallets);

  const cryptosBalancesOfAllWallets = aggregateBalances(wallets);

  return (
    <section className="w-full p-4 pt-0 lg:pl-0">
      <Card className="h-fit w-full max-w-full">
        <CardHeader className="w-full pb-2">
          <CardTitle className="flex w-full items-center justify-between">
            Spread of Cryptos
          </CardTitle>
          <CardDescription>
            Spread of your wallets cryptos balances.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full p-2">
          <PieChartGraph datas={cryptosBalancesOfAllWallets} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            This section shows the spread of your wallets cryptos balances in
            percent.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
