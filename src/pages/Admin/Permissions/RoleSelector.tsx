import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/selectWithoutForm";

import { RoleType } from "@/types/admin/role";

export default function RoleSelector({
  roles,
  selectedRole,
  onRoleChange,
}: {
  roles: RoleType[];
  selectedRole: string;
  onRoleChange: (value: string) => void;
}) {
  return (
    <div className="w-[250px]">
      <Label htmlFor="role">Rôle</Label>
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger id="role">
          <SelectValue placeholder="Sélectionner un rôle" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role: any) => (
            <SelectItem key={role.name} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
