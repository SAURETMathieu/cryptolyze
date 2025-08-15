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

export function WalletSpread() {
  const wallets = useWalletsStore((state) => state.wallets);
  const datas = wallets.map((wallet) => ({
    name: wallet.name,
    value: parseFloat(wallet.balance.toFixed(2)),
  }));
  datas.sort((a: any, b: any) => b.value - a.value);
  if (datas.length > 5) {
    const others = datas.slice(4);
    const othersValue = others.reduce(
      (acc: number, cur: any) => acc + cur.value,
      0
    );
    datas.splice(4, datas.length - 4, {
      name: "Others",
      value: parseFloat(othersValue.toFixed(2)),
    });
  }
  return (
    <section className="w-full p-4 pt-0 lg:pl-0">
      <Card className="h-fit w-full max-w-full">
        <CardHeader className="w-full pb-2">
          <CardTitle className="flex w-full items-center justify-between">
            Spread of Wallets
          </CardTitle>
          <CardDescription>Spread of your wallets balances.</CardDescription>
        </CardHeader>
        <CardContent className="w-full p-2">
          <PieChartGraph datas={datas} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            This section shows the spread of your wallets balances in percent.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
