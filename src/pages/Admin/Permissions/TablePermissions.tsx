"use client";

import { Dispatch, SetStateAction } from "react";
import RowSkeleton from "@/src/components/tables/RowSkeleton";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useModal } from "@/src/context/modalProvider";
import { Eye, Table2, TableProperties } from "lucide-react";

import { TablePrivilegesType } from "@/types/admin/role";

import ColumnPermissions from "./ColumnPermissions";

const permissionsTable = [
  "can_insert",
  "can_update",
  "can_delete",
  "can_select",
  "can_reference",
  "can_truncate",
  "can_trigger",
];

export default function TablePermissions({
  permissions,
  setTablesPermissions,
  currentSchema,
  currentRole,
  isPending,
}: {
  permissions: TablePrivilegesType[];
  setTablesPermissions: Dispatch<SetStateAction<TablePrivilegesType[]>>;
  currentSchema: string;
  currentRole: string;
  isPending: boolean;
}) {
  const { openModal, setMaxWidth, setTitle, setDescription } = useModal();

  const handlePermissionChange = (
    tableName: string,
    permission: string,
    checked: boolean
  ) => {
    setTablesPermissions((prevTables) =>
      prevTables.map((table) =>
        table.table_name === tableName
          ? {
              ...table,
              [permission]: checked,
              table_name: tableName,
              role_name: currentRole,
              schema_name: currentSchema,
            }
          : table
      )
    );
  };

  const handleOpenModal = (tableName: string) => {
    setTitle(`Table: ${tableName}`);
    setDescription(`Schéma: ${currentSchema} Role: ${currentRole}`);
    setMaxWidth("max-w-3xl");
    const modalContent = (
      <ColumnPermissions
        role={currentRole}
        schema={currentSchema}
        table={tableName}
        tablesPermissions={permissions}
        setTablesPermissions={setTablesPermissions}
      />
    );
    openModal(modalContent);
  };

  return (
    <Table className="max-w-full" parentClassName="max-h-[60vh]">
      <TableHeader className="sticky top-0 z-10">
        <TableRow className="">
          <TableHead className="bg-background text-background-foreground max-w-[300px] truncate uppercase">
            table
          </TableHead>
          {permissionsTable.map((permission) => (
            <TableHead
              key={`${permission}-header`}
              className="bg-background text-background-foreground w-[120px] uppercase"
            >
              {permission?.substring(4)}
            </TableHead>
          ))}
          <TableHead className="bg-background text-background-foreground">
            Colonnes
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {isPending ? (
          <RowSkeleton
            nbRows={8}
            nbColumns={permissionsTable.length + 2}
            width="auto"
            minWidth="auto"
            maxWidth="auto"
          />
        ) : permissions.length > 0 ? (
          permissions.map((table) => (
            <TableRow className="hover:bg-background" key={table.table_name}>
              <TableCell className="py-1">
                <div className="flex items-center gap-2">
                  {table.table_type === "VIEW" ? (
                    <Eye size={18} className="block" />
                  ) : (
                    <Table2 size={18} className="block" />
                  )}
                  <span>{table.table_name}</span>
                </div>
              </TableCell>
              {permissionsTable.map((permission) => {
                const partialPermissionKey = `partial_${permission.replace("can_", "")}`;
                return (
                  <TableCell
                    key={permission}
                    className="max-w-[120px] py-1 text-center"
                  >
                    <Switch
                      id={`table-${table.table_name}-${permission}`}
                      checked={!!table[permission as keyof typeof table]}
                      className={`data-[state=checked]:bg-green-600 hover:data-[state=checked]:bg-green-700 ${
                        table[partialPermissionKey as keyof typeof table]
                          ? "data-[state=unchecked]:bg-yellow-400 hover:data-[state=unchecked]:bg-yellow-300 "
                          : "data-[state=unchecked]:bg-red-600 hover:data-[state=unchecked]:bg-red-500 "
                      } `}
                      onCheckedChange={(checked) => {
                        handlePermissionChange(
                          table.table_name,
                          permission,
                          checked
                        );
                      }}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="py-1 text-center">
                <Button
                  variant="primary"
                  size="icon"
                  className="size-9"
                  onClick={() => handleOpenModal(table.table_name)}
                >
                  <TableProperties size={22} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-background">
            <TableCell
              className="text-muted-foreground h-16 text-center"
              colSpan={permissionsTable.length + 2}
            >
              No tables found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
