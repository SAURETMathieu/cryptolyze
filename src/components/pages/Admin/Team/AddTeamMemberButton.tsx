"use client";

import { Button } from "@/src/components/ui/button";
import { useModal } from "@/src/context/modalProvider";
import { Plus } from "lucide-react";

import { TeamMemberType } from "@/types/admin/teams";

import { ComboboxUsers } from "./ComboboxUsers";

export default function AddTeamMemberButton({
  setTeamMembersState,
}: {
  setTeamMembersState: React.Dispatch<React.SetStateAction<TeamMemberType[]>>;
}) {
  const { openModal, setTitle, setDescription } = useModal();

  const addMemberModalContent = (
    <ComboboxUsers setTeamMembersState={setTeamMembersState} />
  );

  const handleAddMember = () => {
    setTitle("Ajouter un membre");
    setDescription(
      "Veuillez entrer l'adresse email du membre que vous souhaitez ajouter"
    );
    openModal(addMemberModalContent);
  };

  return (
    <Button className="self-end" onClick={handleAddMember}>
      <span className="flex items-center justify-between gap-2">
        {<Plus className="size-4" />}
        Ajouter un membre
      </span>
    </Button>
  );
}
