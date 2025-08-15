import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deleteTeamMembers } from "@/src/app/actions/admin/teams";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useDeleteModal } from "@/src/context/deleteModalProvider";
import { useModal } from "@/src/context/modalProvider";
import { useAuth } from "@/src/context/userProvider";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { RoleType } from "@/types/admin/role";
import { TeamMemberType } from "@/types/admin/teams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";

import UpdateRoleModalContent from "./UpdateRoleModalContent";

export const TeamMemberCard = ({
  teamMember,
  roles,
  setTeamMembersState,
}: {
  teamMember: TeamMemberType;
  roles: RoleType[];
  setTeamMembersState: Dispatch<SetStateAction<TeamMemberType[]>>;
}) => {
  const { openModal, setTitle, isOpen, setDescription } = useModal();
  const {
    openModal: openDeleteModal,
    setTitle: setDeleteModalTitle,
    setDescription: setDeleteModalDescription,
  } = useDeleteModal();

  const [currentRole, setCurrentRole] = useState(teamMember.pg_role as string);
  const [selectedRole, setSelectedRole] = useState(
    teamMember.pg_role as string
  );

  const { user } = useAuth();

  const modalContent = (role: string) => {
    return (
      <UpdateRoleModalContent
        setSelectedRole={setSelectedRole}
        setCurrentRole={setCurrentRole}
        setTeamMembersState={setTeamMembersState}
        teamMember={teamMember}
        currentRole={currentRole}
        role={role}
      />
    );
  };

  const deleteTeamMembersFunction = async (ids: string[] | number[]) => {
    const { success, message } = await deleteTeamMembers(ids);
    if (success) {
      setTeamMembersState((prev) =>
        prev.filter((member) => member.id !== ids[0])
      );
      toast.success(message);
      return true;
    }
    toast.error(message);
    return false;
  };

  const handleRemoveMemberTeam = () => {
    if (!user || user.id === teamMember.id) {
      toast.error("Vous ne pouvez pas quitter l'équipe");
      return;
    }
    if (
      teamMember.pg_role === "service_role" ||
      teamMember.pg_role === "admin"
    ) {
      toast.error("Vous ne pouvez pas supprimer un administrateur de l'équipe");
      return;
    }
    setDeleteModalTitle("Suppression de membre");
    setDeleteModalDescription(
      `Êtes-vous sûr de vouloir supprimer ${teamMember.last_name} ${teamMember.first_name} de l'équipe?`
    );
    openDeleteModal([teamMember.id as string], deleteTeamMembersFunction);
  };

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [isOpen, currentRole]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setTitle("Changement de rôle");
    setDescription(
      `Êtes-vous sûr de vouloir attribuer le rôle "${role}" à ${teamMember.last_name} ${teamMember.first_name}?`
    );
    openModal(modalContent(role));
  };

  return (
    <Card className="bg-background p-2">
      <CardHeader className="relative py-4">
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-background absolute right-3 top-4 cursor-pointer border-none text-red-500 hover:scale-105 hover:text-red-600"
          onClick={handleRemoveMemberTeam}
        >
          <Trash2 size={18} />
        </Button>
        <CardTitle
          className="max-w-full truncate"
          title={teamMember.last_name + " " + teamMember.first_name}
        >
          <span className="font-medium capitalize leading-none">
            {teamMember.last_name}
          </span>
          <span className="ml-1 font-medium capitalize leading-none">
            {teamMember.first_name}
          </span>
        </CardTitle>
        <CardDescription>{teamMember.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedRole}
          onValueChange={(value) => handleRoleChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem
                key={role.name}
                value={role.name}
                className="capitalize"
              >
                <span className="capitalize">{role.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
