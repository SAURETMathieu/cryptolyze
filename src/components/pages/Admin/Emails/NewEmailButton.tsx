"use client";

import { Button } from "@/src/components/ui/button";
import { useModal } from "@/src/context/modalProvider";
import { Plus } from "lucide-react";

import { EmailConfigForm } from "./EmailConfigForm";

export function NewEmailButton() {
  const { openModal, setTitle, setDescription } = useModal();
  return (
    <Button
      onClick={() => {
        setTitle("Nouveau email");
        setDescription("Créer un nouveau email");
        openModal(<EmailConfigForm />);
      }}
    >
      <Plus size={16} className="mr-2" />
      Nouveau email
    </Button>
  );
}
