import { useState } from "react";
import { CheckCircle, Download, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CryptoHistoriesStatusModalProps {
  crypto: any;
}

export function CryptoHistoriesStatusModal({
  crypto,
}: CryptoHistoriesStatusModalProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const handleFetchYear = async (year: string) => {
    setIsLoading((prev) => ({ ...prev, [year]: true }));

    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const response = await fetch(
        `/api/crypto-history?crypto=${crypto.asset}&interval=1m&startDate=${startDate}&endDate=${endDate}`
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Données ${year} récupérées avec succès pour ${crypto.name}`
        );
      } else {
        throw new Error(result.error || "Erreur lors de la récupération");
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [year]: false }));
    }
  };

  const handleFetchAllMissing = async () => {
    setIsLoadingAll(true);

    try {
      const incompleteYears = Object.entries(crypto.history_completeness || {})
        .filter(([_, isComplete]) => !isComplete)
        .map(([year]) => year)
        .sort((a, b) => parseInt(a) - parseInt(b)); // Trier par année croissante

      if (incompleteYears.length === 0) {
        toast.info("Aucune année manquante à récupérer");
        return;
      }

      toast.info(
        `Début de la récupération de ${incompleteYears.length} année(s) manquante(s)...`
      );

      let successCount = 0;
      let errorCount = 0;

      for (const year of incompleteYears) {
        try {
          const startDate = `${year}-01-01`;
          const endDate = `${year}-12-31`;

          const response = await fetch(
            `/api/crypto-history?crypto=${crypto.asset}&interval=1d&startDate=${startDate}&endDate=${endDate}`
          );

          const result = await response.json();

          if (result.success) {
            successCount++;
            toast.success(`✅ ${year} récupérée`);
          } else {
            errorCount++;
            toast.error(`❌ Erreur ${year}: ${result.error}`);
          }

          // Délai entre les requêtes pour éviter la surcharge
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error: any) {
          errorCount++;
          toast.error(`❌ Erreur ${year}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Récupération terminée: ${successCount} succès, ${errorCount} erreurs`
        );
        window.location.reload();
      } else {
        toast.error("Aucune année n'a pu être récupérée");
      }
    } catch (error: any) {
      toast.error(`Erreur générale: ${error.message}`);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const years = Object.entries(crypto.history_completeness || {}).sort(
    ([a], [b]) => parseInt(b) - parseInt(a)
  ); // Trier par année décroissante

  const incompleteYears = years.filter(([_, isComplete]) => !isComplete);
  const completeYears = years.filter(([_, isComplete]) => isComplete);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={crypto.logo_url}
          alt={crypto.name}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{crypto.name}</h3>
          <p className="text-sm text-muted-foreground">{crypto.asset}</p>
        </div>
      </div>

      {/* Bouton pour télécharger toutes les années manquantes */}
      {incompleteYears.length > 0 && (
        <Card className="p-4 bg-orange-100 border-orange-200">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-orange-700">
                  Téléchargement en lot
                </h4>
                <p className="text-sm text-orange-700 font-light">
                  {incompleteYears.length} année(s) manquante(s) •{" "}
                  {completeYears.length} année(s) complète(s)
                </p>
              </div>
              <Button
                onClick={handleFetchAllMissing}
                disabled={isLoadingAll}
                variant="primary"
              >
                {isLoadingAll ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Téléchargement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Télécharger tout ({incompleteYears.length})
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {years.map(([year, isComplete]) => (
          <Card key={year} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{year}</span>
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isComplete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFetchYear(year)}
                      disabled={isLoading[year] || isLoadingAll}
                      className="h-7 px-2"
                    >
                      {isLoading[year] ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Download className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
