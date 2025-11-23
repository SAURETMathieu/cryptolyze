"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { StrategiesTable } from "@/src/modules/strategies/table/StrategiesTable";

import { CryptoTabsContent } from "./Cryptos/CryptoTabsContent";

export function StrategiesPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("strategies");

  const handleStrategySelect = (strategyId: number) => {
    setSelectedStrategy(strategyId);
    setActiveTab("strategy-details");
  };

  const handleCryptoSelect = (cryptoId: number) => {
    setSelectedCrypto(cryptoId);
    setActiveTab("crypto-details");
  };

  return (
    <main className="flex min-h-screen flex-1 max-lg:flex-col sm:py-4 sm:pl-14">
      <section className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Gestionnaire de Stratégies Crypto
          </h1>
          <p className="text-muted-foreground">
            Gérez vos stratégies de trading, analysez les résultats et suivez
            les performances
          </p>
        </div>

        <Tabs className="w-full" defaultValue="strategies">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategies">Stratégies</TabsTrigger>
            <TabsTrigger value="strategy-details">
              Détails Stratégie
            </TabsTrigger>
            <TabsTrigger value="crypto-details">Détails Crypto</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Stratégies</CardTitle>
                <CardDescription>
                  Cliquez sur une stratégie pour voir ses résultats par crypto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StrategiesTable
                  onStrategySelect={handleStrategySelect}
                  onCryptoSelect={handleCryptoSelect}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy-details" className="space-y-4">
            {selectedStrategy ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Détails de la Stratégie #{selectedStrategy}
                  </CardTitle>
                  <CardDescription>
                    Résultats de cette stratégie pour toutes les cryptos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Composant StrategyDetails à implémenter
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Sélectionnez une stratégie pour voir ses détails
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <CryptoTabsContent />
        </Tabs>
      </section>
    </main>
  );
}
