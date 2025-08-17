import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TabsContent } from "@/src/components/ui/tabs";
import { Database, TrendingDown, TrendingUp } from "lucide-react";

import { CryptoHistoriesStatusTable } from "./Table/CryptoHistoriesStatusTable";

export function CryptoTabsContent() {
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cryptomonnaies
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{100}</div>
                <p className="text-xs text-muted-foreground">
                  Suivies dans le dashboard
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Données Complètes
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(100)}%</div>
                <p className="text-xs text-muted-foreground">
                  Moyenne de complétude
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Données Manquantes
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{0}</div>
                <p className="text-xs text-muted-foreground">
                  Années à récupérer
                </p>
              </CardContent>
            </Card>
          </div>
          <CryptoHistoriesStatusTable />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
