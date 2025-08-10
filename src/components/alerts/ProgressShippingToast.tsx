import { Progress } from "@/src/components/ui/progress";
import { CheckCircle, Loader2 } from "lucide-react";

export function ProgressShippingToast({
  currentProgress,
  validOrdersToShip,
}: {
  currentProgress: number;
  validOrdersToShip: number;
}) {
  const percentage = Math.round((currentProgress / validOrdersToShip) * 100);
  const remaining = validOrdersToShip - currentProgress;
  const isComplete = currentProgress === validOrdersToShip;
  return (
    <div className="w-full rounded-lg p-2">
      <h3 className="text-sm font-medium">Progression</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          {currentProgress}/{validOrdersToShip} ({percentage}%)
          {remaining > 0 &&
            ` - ${remaining} restant${remaining > 1 ? "s" : ""}`}
          {isComplete ? (
            <CheckCircle className="ml-2 size-4 text-green-600" />
          ) : (
            <Loader2 className="text-muted-foreground ml-2 size-4 animate-spin" />
          )}
        </div>
        <Progress
          value={percentage}
          className="bg-background border-primary h-1.5 border"
          getColor={(value) => "bg-primary"}
        />
        <div className="text-muted-foreground text-center text-xs">
          {isComplete
            ? "Processus terminé avec succès"
            : "Processus en cours..."}
        </div>
      </div>
    </div>
  );
}
