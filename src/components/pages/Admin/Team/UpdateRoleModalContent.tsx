"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { updateUserRole } from "@/src/app/actions/admin/roles";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { Button } from "@/src/components/ui/button";
import { useModal } from "@/src/context/modalProvider";
import { useAuth } from "@/src/context/userProvider";
import { toast } from "sonner";

import { TeamMemberType } from "@/types/admin/teams";

interface UpdateRoleModalContentProps {
  setSelectedRole: Dispatch<SetStateAction<string>>;
  setCurrentRole: Dispatch<SetStateAction<string>>;
  setTeamMembersState: Dispatch<SetStateAction<TeamMemberType[]>>;
  currentRole: string;
  role: string;
  teamMember: TeamMemberType;
}

export default function UpdateRoleModalContent({
  setSelectedRole,
  setCurrentRole,
  setTeamMembersState,
  currentRole,
  role,
  teamMember,
}: UpdateRoleModalContentProps) {
  const [isPending, startTransition] = useTransition();
  const { closeModal, isOpen } = useModal();
  const { user } = useAuth();

  const submitUpdateRole = async (role: string) => {
    if (!user || user.id === teamMember.id) {
      toast.error("Vous ne pouvez pas modifier votre propre rôle");
      return;
    }
    if (
      teamMember.pg_role === "service_role" ||
      teamMember.pg_role === "admin"
    ) {
      toast.error("Vous ne pouvez pas modifier le rôle d'un administrateur");
      return;
    }
    startTransition(async () => {
      const { message, success } = await updateUserRole(
        role,
        teamMember.id as string
      );
      if (success) {
        toast.success(message);
        setTeamMembersState((prev) =>
          prev.map((member) => {
            if (member.id === teamMember.id) {
              return { ...member, pg_role: role };
            }
            return member;
          })
        );
        setCurrentRole(role);
        if (isOpen) {
          closeModal();
        }
      } else {
        toast.error(message);
      }
    });
  };

  return (
    <div className="mt-4 flex justify-end gap-4">
      <Button
        variant="outline"
        onClick={() => {
          setSelectedRole(currentRole);
          closeModal();
        }}
        disabled={isPending}
      >
        Annuler
      </Button>
      <Button onClick={() => submitUpdateRole(role)} disabled={isPending}>
        {isPending ? <LoadIcon size={24} /> : "Confirmer"}
      </Button>
    </div>
  );
}
