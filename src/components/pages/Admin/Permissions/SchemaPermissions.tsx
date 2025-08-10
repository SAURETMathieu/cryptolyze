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

import { SchemaPrivilegesType } from "@/types/admin/role";

export default function SchemaPermissions({
  permissions,
  setSchemasPermissions,
  isPending,
  currentRole,
}: {
  permissions: SchemaPrivilegesType[];
  setSchemasPermissions: Dispatch<SetStateAction<SchemaPrivilegesType[]>>;
  isPending: boolean;
  currentRole: string;
}) {
  const handleSchemaPermissionChange = (
    schemaName: string,
    checked: boolean
  ) => {
    setSchemasPermissions((prevSchemas) =>
      prevSchemas.map((schemaPermission) =>
        schemaPermission.schema_name === schemaName
          ? {
              ...schemaPermission,
              usage_privilege: checked,
              role_name: currentRole,
            }
          : schemaPermission
      )
    );
  };
  return (
    <Table className="w-fit" parentClassName="max-h-[55vh]">
      <TableHeader className="sticky top-0 z-10">
        <TableRow>
          <TableHead className="bg-background text-background-foreground max-w-[300px] truncate uppercase">
            schema
          </TableHead>
          <TableHead className="bg-background text-background-foreground w-[160px] uppercase">
            Can usage
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
          permissions.map((schemaPermission) => (
            <TableRow
              className="hover:bg-background"
              key={schemaPermission.schema_name}
            >
              <TableCell className="max-w-[300px] truncate py-2">
                {schemaPermission.schema_name}
              </TableCell>
              <TableCell className="py-2 text-center">
                <Switch
                  id={`schema-${schemaPermission.schema_name}`}
                  checked={schemaPermission.usage_privilege}
                  onCheckedChange={(checked) =>
                    handleSchemaPermissionChange(
                      schemaPermission.schema_name,
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
              colSpan={2}
            >
              No schemas found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
