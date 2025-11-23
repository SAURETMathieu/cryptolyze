"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DataTable } from "../../../components/tables/DataTable";
import { createColumns } from "./strategiesColumns";

interface StrategyTableProps {
  onStrategySelect: (strategyId: number) => void;
  onCryptoSelect: (cryptoId: number) => void;
}

export function StrategiesTable({
  onStrategySelect,
  onCryptoSelect,
}: StrategyTableProps) {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tTable = useTranslations("Tables");

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/strategies");
      const result = await response.json();

      if (result.success) {
        setStrategies(result.data);
      } else {
        toast.error("Erreur lors du chargement des stratégies");
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des stratégies");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des stratégies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Stratégies disponibles</h3>
          <p className="text-sm text-muted-foreground">
            {strategies.length} stratégie(s) trouvée(s)
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Stratégie
        </Button>
      </div>

      {strategies.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Aucune stratégie trouvée
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer votre première stratégie
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={createColumns(tTable)}
          data={strategies}
          hideExport={false}
        />
      )}
    </div>
  );
}
