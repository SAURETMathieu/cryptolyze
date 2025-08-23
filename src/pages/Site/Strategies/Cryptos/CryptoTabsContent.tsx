import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TabsContent } from "@/src/components/ui/tabs";
import {
  fetchAllCryptoHistories,
  useCryptoHistoryStore,
} from "@/src/store/cryptoHistory.store";
import { Database, LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

import { CryptoHistoriesStatusTable } from "./Table/CryptoHistoriesStatusTable";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function CryptoTabsContent() {
  // Store state
  const cryptoHistories = useCryptoHistoryStore(
    (state) => state.cryptoHistories
  );

  // Calculs
  const totalCryptos = cryptoHistories.length;
  const totalYears = cryptoHistories.reduce(
    (acc, crypto) =>
      acc + Object.keys(crypto.history_completeness || {}).length,
    0
  );

  const completeYears = cryptoHistories.reduce(
    (acc, crypto) =>
      acc +
      Object.values(crypto.history_completeness || {}).filter(
        (year) => year === "complete"
      ).length,
    0
  );

  const loadingYears = cryptoHistories.reduce(
    (acc, crypto) =>
      acc +
      Object.values(crypto.history_completeness || {}).filter(
        (year) => year === "loading"
      ).length,
    0
  );

  const incompleteYears = totalYears - completeYears;

  const completePercentage = Math.round((completeYears / totalYears) * 100);

  // Fetch data
  useEffect(() => {
    fetchAllCryptoHistories();
  }, []);

  return (
    <TabsContent value="crypto-details" className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Cryptomonnaies</CardTitle>
          <CardDescription>
            Gestion de l'historique des prix par année
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Cryptomonnaies"
              value={totalCryptos}
              description="Suivies dans le dashboard"
              icon={Database}
            />
            <StatsCard
              title="Données Complètes"
              value={`${completePercentage}%`}
              description="Moyenne de complétude"
              icon={TrendingUp}
            />
            <StatsCard
              title="Données Manquantes"
              value={incompleteYears}
              description={`En attente de ${loadingYears} / ${totalYears}`}
              icon={TrendingDown}
            />
          </div>
          <CryptoHistoriesStatusTable />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
