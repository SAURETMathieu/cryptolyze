"use client";

import * as React from "react";
import { addTeamMember } from "@/src/app/actions/admin/users";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { useModal } from "@/src/context/modalProvider";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { TeamMemberType } from "@/types/admin/teams";
import { UsersByEmail } from "@/types/admin/users";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Search } from "./SearchUsers";

export function ComboboxUsers({
  setTeamMembersState,
}: {
  setTeamMembersState: React.Dispatch<React.SetStateAction<TeamMemberType[]>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<UsersByEmail | undefined>();
  const [isPending, startTransition] = React.useTransition();
  const { closeModal, isOpen } = useModal();

  const handleSetActive = React.useCallback((user: any) => {
    setSelected(user);
    setOpen(false);
  }, []);

  const displayName = selected ? selected.email : "Select a user";

  const handleSubmit = async () => {
    if (!selected) return;
    startTransition(async () => {
      const {
        success,
        message,
        data: newTeamMember,
      } = await addTeamMember(selected.id);

      if (success && newTeamMember) {
        setSelected(undefined);
        setTeamMembersState((prev) => [...prev, newTeamMember]);
        toast.success("L'utilisateur a été ajouté avec succès");
        if (isOpen) {
          closeModal();
        }
      } else {
        toast.error(
          "Une erreur s'est produite lors de l'ajout de l'utilisateur"
        );
        console.error(message);
      }
    });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-[300px] justify-between")}
          >
            {displayName}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="bottom" className={cn("w-[300px] p-0")}>
          <Search selectedResult={selected} onSelectResult={handleSetActive} />
        </PopoverContent>
      </Popover>
      <Button
        type="submit"
        disabled={isPending || !selected}
        className="w-full"
        onClick={handleSubmit}
      >
        {isPending ? <LoadIcon size={24} /> : "Ajouter l'utilisateur"}
      </Button>
    </>
  );
}
