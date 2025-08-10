import { cn } from "@/src/lib/utils";
import { Edit, Plus, Trash2 } from "lucide-react";

import { Badge } from "./badge";

interface EventStats {
  insertCount: number;
  updateCount: number;
  deleteCount: number;
}

interface EventFloodToastContentProps {
  stats: EventStats;
  className?: string;
  title: string;
  description: string;
}

export function EventFloodToastContent({
  stats,
  className,
  title,
  description,
}: EventFloodToastContentProps) {
  const { insertCount, updateCount, deleteCount } = stats;

  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-base font-semibold text-yellow-900">{description}</p>
      <div className={cn("mt-2 flex flex-col gap-1", className)}>
        {insertCount > 0 && (
          <Badge variant="green" className="w-fit text-base">
            <Plus className="mr-1 size-3" />
            {insertCount} insertion{insertCount > 1 ? "s" : ""}
          </Badge>
        )}

        {updateCount > 0 && (
          <Badge variant="blue" className="w-fit text-base">
            <Edit className="mr-1 size-3" />
            {updateCount} mise{updateCount > 1 ? "s" : ""} à jour
          </Badge>
        )}

        {deleteCount > 0 && (
          <Badge variant="red" className="w-fit text-base">
            <Trash2 className="mr-1 size-3" />
            {deleteCount} suppression{deleteCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>
    </div>
  );
}

// Utility function to calculate stats from payloads
export function calculateEventStats<T extends { eventType: string }>(
  payloads: T[]
): EventStats {
  return {
    insertCount: payloads.filter((p) => p.eventType === "INSERT").length,
    updateCount: payloads.filter((p) => p.eventType === "UPDATE").length,
    deleteCount: payloads.filter((p) => p.eventType === "DELETE").length,
  };
}
