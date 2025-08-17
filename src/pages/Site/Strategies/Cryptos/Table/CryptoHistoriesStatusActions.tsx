"use client";

import { useModal } from "@/src/context/modalProvider";
import { Row } from "@tanstack/react-table";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CryptoHistoriesStatusModal } from "./CryptoHistoriesStatusModal";

interface ActionsProps<TData> {
  row: Row<TData>;
}

export function CryptoHistoriesStatusActions<TData>({
  row,
}: ActionsProps<TData>) {
  const crypto = row.original as any;
  const { openModal, setDescription, setTitle } = useModal();

  const handleOpenModal = () => {
    setTitle(`Historique complet - ${crypto.name} (${crypto.asset})`);
    setDescription(`Gestion des données historiques par année`);
    openModal(<CryptoHistoriesStatusModal crypto={crypto} />);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="primary"
        className=""
        onClick={handleOpenModal}
        title="Gestion des données historiques par année"
      >
        <Calendar size={16} className="mr-2" /> Voir tout
      </Button>
    </div>
  );
}
