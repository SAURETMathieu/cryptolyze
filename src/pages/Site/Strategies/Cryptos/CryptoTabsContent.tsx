import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TabsContent } from "@/src/components/ui/tabs";
import { getCryptoHistoryCompleteness } from "@/src/utils/getCryptoHistoryCompleteness";
import { Database, LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
  const [isFetching, setIsFetching] = useState(true);
  const [cryptos, setCryptos] = useState<any[]>([]);

  const totalCryptos = cryptos.length;
  const completeCryptos = cryptos.reduce(
    (acc, crypto) =>
      acc + getCryptoHistoryCompleteness(crypto.history_completeness),
    0
  );
  const incompleteCryptos = cryptos.reduce(
    (acc, crypto) =>
      acc + !getCryptoHistoryCompleteness(crypto.history_completeness),
    0
  );

  const completePercentage = Math.round((completeCryptos / totalCryptos) * 100);
  const incompletePercentage = Math.round(
    (incompleteCryptos / totalCryptos) * 100
  );

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch("/api/crypto-histories");
        const { data, success } = await response.json();
        if (success) {
          setCryptos(data);
        } else {
          throw new Error(data.message);
        }
        setIsFetching(false);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCryptos();
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
              value={incompletePercentage}
              description="Années à récupérer"
              icon={TrendingDown}
            />
          </div>
          <CryptoHistoriesStatusTable
            cryptos={cryptos}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
