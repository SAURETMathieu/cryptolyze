import { TriggerType } from "@/src/store/admin/trigger.store";
import { getTriggerTypeBadges } from "@/src/utils/getColorAndText/triggers";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TriggerDetailsModalProps {
  trigger: TriggerType;
}
export function TriggerDetailsModal({ trigger }: TriggerDetailsModalProps) {
  return (
    <Tabs defaultValue="trigger">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="trigger">Définition du Trigger</TabsTrigger>
        <TabsTrigger value="function">Définition de la Fonction</TabsTrigger>
      </TabsList>
      <TabsContent value="trigger" className="h-[68vh] space-y-4">
        <div className="bg-muted rounded-md p-4">
          <pre className="max-h-[300px] min-h-[300px] overflow-auto whitespace-pre-wrap text-sm">
            {trigger.trigger_definition}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Détails du Trigger</h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Table:</span>
              <span>{trigger.full_table_name}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Schéma:</span>
              <span>{trigger.table_schema}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Statut:</span>
              <span>{trigger.enabled === "O" ? "Actif" : "Inactif"}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Scope:</span>
              <span>{trigger.trigger_scope}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Timing:</span>
              <span>{trigger.trigger_timing}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Types d&apos;événements</h3>
          <div className="flex flex-wrap gap-2">
            {getTriggerTypeBadges(trigger)}
          </div>
        </div>

        {trigger.update_columns && trigger.update_columns.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Colonnes de mise à jour</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(trigger.update_columns) ? (
                trigger.update_columns.map((column: any) => (
                  <Badge key={column} variant="secondary">
                    {column}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  Aucune colonne spécifiée
                </span>
              )}
            </div>
          </div>
        )}
      </TabsContent>
      <TabsContent value="function" className="h-[65vh]">
        <div className="bg-muted rounded-md p-4">
          <pre className="max-h-[300px] min-h-[300px] overflow-auto whitespace-pre-wrap text-sm">
            {trigger.function_definition}
          </pre>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Détails de la Fonction</h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Nom:</span>
              <span>{trigger.function_name}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Schéma:</span>
              <span>{trigger.function_schema}</span>
            </div>
            <div className="flex justify-between rounded-md border p-2">
              <span className="font-medium">Propriétaire:</span>
              <span>{trigger.function_owner}</span>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
