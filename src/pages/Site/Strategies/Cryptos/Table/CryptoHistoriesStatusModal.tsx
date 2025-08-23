import { useState } from "react";
import {
  updateCryptoHistoryByIdStore,
  useCryptoHistoryStore,
} from "@/src/store/cryptoHistory.store";
import { CryptoYearlyHistoryStatusType } from "@/types";
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CryptoHistoriesStatusModalProps {
  crypto: CryptoYearlyHistoryStatusType;
}

export function CryptoHistoriesStatusModal({
  crypto,
}: CryptoHistoriesStatusModalProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const cryptoHistories = useCryptoHistoryStore(
    (state) => state.cryptoHistories
  );
  const currentCrypto =
    cryptoHistories.find((c) => c.id === crypto.id) || crypto;

  const handleFetchYear = async (year: string) => {
    setIsLoading((prev) => ({ ...prev, [year]: true }));

    try {
      const response = await fetch(`/api/crypto-history-request`, {
        method: "POST",
        body: JSON.stringify({
          crypto_id: currentCrypto.id,
          year: parseInt(year),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        updateCryptoHistoryByIdStore(currentCrypto.id!, {
          history_completeness: {
            ...((currentCrypto.history_completeness as Record<
              string,
              string
            >) || {}),
            [year]: "loading",
          },
        });
      } else {
        throw new Error(
          result.message ||
            "Erreur lors de la demande d'historique des données pour l'année " +
              year +
              " pour la crypto " +
              currentCrypto.name
        );
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
      const notRequestedYears = Object.entries(
        currentCrypto.history_completeness || {}
      )
        .filter(([_, status]) => status === "not_requested")
        .map(([year]) => year)
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (notRequestedYears.length === 0) {
        toast.info("Aucune année manquante à récupérer");
        return;
      }

      toast.info(
        `Début de la récupération de ${notRequestedYears.length} année(s) manquante(s)...`
      );

      let successCount = 0;
      let errorCount = 0;
      const yearsToUpdate = [];

      for (const year of notRequestedYears) {
        try {
          const response = await fetch(`/api/crypto-history-request`, {
            method: "POST",
            body: JSON.stringify({
              crypto_id: currentCrypto.id,
              year: parseInt(year),
            }),
          });

          const result = await response.json();

          if (result.success) {
            successCount++;
            yearsToUpdate.push(year);
          } else {
            errorCount++;
            toast.error(result.message);
          }
        } catch (error: any) {
          errorCount++;
          toast.error(`❌ Erreur ${year}: ${error.message}`);
        }
      }

      updateCryptoHistoryByIdStore(currentCrypto.id!, {
        history_completeness: {
          ...((currentCrypto.history_completeness as Record<string, string>) ||
            {}),
          ...yearsToUpdate.reduce(
            (acc, year) => {
              acc[year] = "loading";
              return acc;
            },
            {} as Record<string, string>
          ),
        },
      });

      if (successCount > 0) {
        toast.success(
          `Récupération terminée: ${successCount} succès, ${errorCount} erreurs`
        );
      } else {
        toast.error("Aucune année n'a pu être récupérée");
      }
    } catch (error: any) {
      toast.error(`Erreur générale: ${error.message}`);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const years = Object.entries(currentCrypto.history_completeness || {}).sort(
    ([a], [b]) => parseInt(b) - parseInt(a)
  ); // Sort by year descending

  const notRequestedYears = years.filter(
    ([_, status]) => status === "not_requested"
  );
  const completeYears = years.filter(([_, status]) => status === "complete");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <img
          src={currentCrypto.logo_url || ""}
          alt={currentCrypto.name || ""}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{currentCrypto.name}</h3>
          <p className="text-sm text-muted-foreground">{currentCrypto.asset}</p>
        </div>
      </div>

      {/* Bouton pour télécharger toutes les années manquantes */}
      {notRequestedYears.length > 0 && (
        <Card className="p-4 bg-orange-100 border-orange-200">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-orange-700">
                  Téléchargement en lot
                </h4>
                <p className="text-sm text-orange-700 font-light">
                  {notRequestedYears.length} année(s) manquante(s) •{" "}
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
                    Télécharger tout ({notRequestedYears.length})
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {years.map(([year, status]) => (
          <Card key={year} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{year}</span>
                  {status === "complete" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : status === "not_requested" ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {status === "not_requested" && (
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
