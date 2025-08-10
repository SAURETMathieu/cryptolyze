"use client";

import { EmailConfigDetails } from "@/src/components/pages/Admin/Emails/EmailConfigDetails";
import { EmailConfigForm } from "@/src/components/pages/Admin/Emails/EmailConfigForm";
import { useModal } from "@/src/context/modalProvider";
import { EmailType } from "@/src/store/admin/email.store";
import { Row } from "@tanstack/react-table";
import { ListCollapse, Pencil, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmailsActionsProps<TData> {
  row: Row<TData>;
}

export function EmailsActions<TData>({ row }: EmailsActionsProps<TData>) {
  const email = row.original as EmailType;
  const { openModal, setDescription, setTitle } = useModal();

  const handleOpenModal = () => {
    setTitle(`Modifier la config d'email`);
    setDescription(`Email key: ${email.key}`);
    openModal(<EmailConfigForm email={email} />);
  };

  const handleOpenDetailsModal = () => {
    setTitle(`Détails de l'email`);
    setDescription(email.key);
    openModal(<EmailConfigDetails email={email} />);
  };

  const handleSendTestEmail = () => {
    setTitle(`Envoyer un email test`);
    setDescription("Choisir un deal");
    openModal(<div>To implement</div>);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={handleSendTestEmail}
        title="Envoyer un email test"
      >
        <Send size={16} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={handleOpenDetailsModal}
        title="Voir les détails de l'email"
      >
        <ListCollapse size={16} />
      </Button>
      <Button
        variant="primary"
        size="icon"
        className="size-8"
        onClick={handleOpenModal}
        title="Modifier la config d'email"
      >
        <Pencil size={16} />
      </Button>
    </div>
  );
}
