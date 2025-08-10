"use client";

import { useWalletsStore } from "@/src/store/wallet.store";
import { useLocale } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  wallet?: any;
}

export function BalanceCard({ wallet }: BalanceCardProps) {
  const locale = useLocale();
  const balanceOfWallet = wallet?.balance;
  const balanceOfAllWallets = useWalletsStore((state) => state.balanceTotal);
  const balanceTotal = wallet ? balanceOfWallet : balanceOfAllWallets;
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const totalBalanceFormatted = new Intl.NumberFormat(locale, options).format(
    balanceTotal
  );
  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle className="text-2xl font-medium">Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalBalanceFormatted}</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
}
