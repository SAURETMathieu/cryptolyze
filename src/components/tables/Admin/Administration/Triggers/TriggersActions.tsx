"use client";

import { useModal } from "@/src/context/modalProvider";
import { TriggerType } from "@/src/store/admin/trigger.store";
import { Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TriggerDetailsModal } from "./TriggerDetailsModal";

interface TriggersActionsProps<TData> {
  row: Row<TData>;
}

export function TriggersActions<TData>({ row }: TriggersActionsProps<TData>) {
  const trigger = row.original as TriggerType;
  const { openModal, setDescription, setTitle, setMaxWidth } = useModal();

  const handleOpenModal = () => {
    setTitle(`Trigger: ${trigger.trigger_name}`);
    setDescription(`Définition du trigger sur ${trigger.full_table_name}`);
    setMaxWidth("max-w-3xl");
    openModal(<TriggerDetailsModal trigger={trigger} />);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenModal}
        title="Voir les détails du trigger"
      >
        <Eye className="size-4" />
      </Button>
    </div>
  );
}
