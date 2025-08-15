"use client";

import { useWalletsStore } from "@/src/store/wallet.store";

import { ColumnConfig } from "@/types/datasTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const columnConfigs: ColumnConfig[] = [
  {
    id: "blockchain",
    title: "Blockchain",
    options: [],
  },
];

export function WalletTableSection() {
  const wallets = useWalletsStore((state) => state.wallets);

  return (
    <section className="w-full gap-4 p-4 pt-0">
      <Card className="h-fit w-full max-w-full">
        <CardHeader className="">
          <CardTitle className="text-xl font-medium">Wallets</CardTitle>
          <CardDescription className="max-w-lg text-balance text-sm leading-relaxed">
            Track your wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {/* <Table
            data={wallets}
            columns={columns}
            columnConfigs={columnConfigs}
          /> */}
        </CardContent>
      </Card>
    </section>
  );
}
