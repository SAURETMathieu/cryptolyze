import { Dispatch, SetStateAction } from "react";
import RowSkeleton from "@/src/components/tables/RowSkeleton";
import { Switch } from "@/src/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { FunctionPrivilegesType } from "@/types/admin/role";

export default function FunctionPermissions({
  permissions,
  setFunctionsPermissions,
  isPending,
  currentSchema,
  currentRole,
}: {
  permissions: FunctionPrivilegesType[];
  setFunctionsPermissions: Dispatch<SetStateAction<FunctionPrivilegesType[]>>;
  isPending: boolean;
  currentSchema: string;
  currentRole: string;
}) {
  const handleFunctionPermissionChange = (
    functionName: string,
    checked: boolean
  ) => {
    setFunctionsPermissions((prevFunctions) =>
      prevFunctions.map((functionPermission) =>
        functionPermission.function_name === functionName
          ? {
              ...functionPermission,
              can_execute: checked,
              role_name: currentRole,
              schema_name: currentSchema,
            }
          : functionPermission
      )
    );
  };

  return (
    <Table className="w-fit" parentClassName="max-h-[55vh]">
      <TableHeader className="sticky top-0 z-10">
        <TableRow>
          <TableHead className="bg-background text-background-foreground max-w-[300px] truncate uppercase">
            function
          </TableHead>
          <TableHead className="bg-background text-background-foreground w-[160px] uppercase">
            Can execute
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <RowSkeleton
            nbRows={8}
            nbColumns={2}
            width="auto"
            minWidth="150px"
            maxWidth="300px"
          />
        ) : permissions.length > 0 ? (
          permissions.map((functionPermission) => (
            <TableRow
              className="hover:bg-background"
              key={functionPermission.function_specific_name}
            >
              <TableCell className="max-w-[300px] truncate py-2">
                {functionPermission.function_name}
              </TableCell>
              <TableCell className="py-2 text-center">
                <Switch
                  id={`function-${functionPermission.function_name}`}
                  checked={functionPermission.can_execute}
                  onCheckedChange={(checked) =>
                    handleFunctionPermissionChange(
                      functionPermission.function_name,
                      checked
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-background">
            <TableCell
              className="text-muted-foreground h-16 text-center"
              colSpan={permissions.length + 2}
            >
              No functions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
