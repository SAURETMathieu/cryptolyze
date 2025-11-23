"use client";

import { useModal } from "@/src/context/modalProvider";
import { Row } from "@tanstack/react-table";
import { Bot, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionsProps<TData> {
  row: Row<TData>;
}

export function StrategiesActions<TData>({ row }: ActionsProps<TData>) {
  const crypto = row.original as any;
  const { openModal, setDescription, setTitle } = useModal();

  // const handleOpenModal = () => {
  //   setTitle(`Historique complet - ${crypto.name} (${crypto.symbol})`);
  //   setDescription(`Gestion des données historiques par année`);
  //   openModal(<CryptoHistoriesStatusModal crypto={crypto} />);
  // };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        className="size-8"
        size="icon"
        // onClick={handleOpenModal}
        title="Voir le détail des performances"
      >
        <Eye size={16} className="" />
      </Button>
      <Button
        variant="primary"
        className="size-8"
        size="icon"
        // onClick={handleOpenModal}
        title="Lancer la stratégie"
      >
        <Bot size={16} className="" />
      </Button>
    </div>
  );
}
