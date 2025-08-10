"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  revokeTablePermission,
  updateColumnsPermissions,
} from "@/src/app/actions/admin/permissions";
import { getColumnsPrivileges } from "@/src/app/actions/admin/roles";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
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
import { getObjectChangesFunction } from "@/src/utils/compare/getObjectChangesFunction";
import { toast } from "sonner";

import { ColumnPrivilegesType, TablePrivilegesType } from "@/types/admin/role";

const permissionsColumn = [
  "can_insert",
  "can_update",
  "can_select",
  "can_references",
];

export default function ColumnPermissions({
  table,
  role,
  schema,
  tablesPermissions,
  setTablesPermissions,
}: {
  role: string;
  schema: string;
  table: string;
  tablesPermissions: TablePrivilegesType[];
  setTablesPermissions: Dispatch<SetStateAction<TablePrivilegesType[]>>;
}) {
  const [columnsPermissions, setColumnsPermissions] = useState<
    ColumnPrivilegesType[]
  >([]);
  const [initialColumns, setInitialColumns] = useState<ColumnPrivilegesType[]>(
    []
  );

  const [isPending, startTransition] = useTransition();
  const [isSubmit, startTransitionSubmit] = useTransition();

  const handlePermissionChange = (
    columnName: string,
    permission: string,
    checked: boolean
  ) => {
    setColumnsPermissions((prevColumns) =>
      prevColumns.map((column) =>
        column.column === columnName
          ? {
              ...column,
              [permission]: checked,
              role_name: role,
              schema_name: schema,
              table_name: table,
            }
          : column
      )
    );
  };

  useEffect(() => {
    fetchColumnsPermissions(schema, role, table);
  }, [schema, role, table]);

  const fetchColumnsPermissions = async (
    schema: string,
    role: string,
    table: string
  ) => {
    startTransition(async () => {
      try {
        const { success, data, message } = await getColumnsPrivileges(
          schema,
          role,
          table
        );
        if (success) {
          setColumnsPermissions(data);
          setInitialColumns(data);
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };

  const handleResetChanges = () => {
    setColumnsPermissions(initialColumns);
  };

  const handleSaveChanges = async () => {
    startTransitionSubmit(async () => {
      let changes: { [key: string]: string | boolean }[] = [];
      changes = getObjectChangesFunction<ColumnPrivilegesType>(
        initialColumns,
        columnsPermissions,
        "column",
        "column"
      );

      const verbs: ("can_insert" | "can_update" | "can_select")[] = [
        "can_insert",
        "can_update",
        "can_select",
      ];
      const columnsStatusBefore = {
        can_insert: initialColumns.every(
          (column) => column.can_insert === false
        ),
        can_update: initialColumns.every(
          (column) => column.can_update === false
        ),
        can_select: initialColumns.every(
          (column) => column.can_select === false
        ),
      };

      const columnsStatusAfter = {
        can_insert: columnsPermissions.every(
          (column) => column.can_insert === false
        ),
        can_update: columnsPermissions.every(
          (column) => column.can_update === false
        ),
        can_select: columnsPermissions.every(
          (column) => column.can_select === false
        ),
      };

      for (const verb of verbs) {
        if (!columnsStatusBefore[verb] && columnsStatusAfter[verb]) {
          const { success, message } = await revokeTablePermission(
            schema,
            role,
            table,
            verb
          );
          if (!success) {
            toast.error(message);
          } else {
            toast.info(`${verb} permission revoked for table ${table}`);
          }
        }
      }

      const updateColumnsSuccess = await updateColumnsPermissions(changes);
      if (updateColumnsSuccess.success) {
        const cleanedColumnsPermissions = columnsPermissions.map(
          (permission) => {
            const cleanedColumnsPermissions: any = { ...permission };
            delete cleanedColumnsPermissions.role_name;
            delete cleanedColumnsPermissions.schema_name;
            delete cleanedColumnsPermissions.table_name;
            return cleanedColumnsPermissions;
          }
        );
        toast.success("Columns permissions updated");
        setInitialColumns(cleanedColumnsPermissions);

        const updatedTablesPermissions = tablesPermissions.map(
          (tablePermission) => {
            if (tablePermission.table_name === table) {
              const hasPartialInsert = cleanedColumnsPermissions.some(
                (column) => column.can_insert === true
              );
              const hasPartialUpdate = cleanedColumnsPermissions.some(
                (column) => column.can_update === true
              );
              const hasPartialSelect = cleanedColumnsPermissions.some(
                (column) => column.can_select === true
              );

              return {
                ...tablePermission,
                partial_insert: hasPartialInsert,
                partial_update: hasPartialUpdate,
                partial_select: hasPartialSelect,
                columns: cleanedColumnsPermissions,
              };
            }
            return tablePermission;
          }
        );

        setTablesPermissions(updatedTablesPermissions);
      } else {
        toast.error("Error updating columns permissions");
      }
      // closeModal();
    });
  };

  return (
    <>
      <Table className="w-fit" parentClassName="max-h-[55vh]">
        <TableHeader className="sticky -top-1 z-10">
          <TableRow>
            <TableHead className="bg-background text-background-foreground max-w-[300px] truncate uppercase">
              column
            </TableHead>
            {permissionsColumn.map((permission) => (
              <TableHead
                key={`${permission}-header`}
                className="bg-background text-background-foreground w-[160px] uppercase"
              >
                {permission?.substring(4)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <RowSkeleton
              nbRows={5}
              nbColumns={permissionsColumn.length + 1}
              width="auto"
              minWidth="120px"
              maxWidth="120px"
            />
          ) : (
            columnsPermissions.map((column) => (
              <TableRow className="hover:bg-background" key={column.column}>
                <TableCell className="max-w-[300px] truncate py-2">
                  {column.column}
                </TableCell>
                {permissionsColumn.map((permission) => (
                  <TableCell key={permission} className="py-2 text-center">
                    <Switch
                      id={`column-${column.column}-${permission}`}
                      checked={!!column[permission as keyof typeof column]}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          column.column,
                          permission,
                          checked
                        )
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="my-4 flex justify-end gap-4">
        <Button
          onClick={handleResetChanges}
          variant="outline"
          disabled={isPending || isSubmit}
        >
          Reset
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={isPending || isSubmit}
          className="min-w-[130px]"
        >
          {isSubmit ? <LoadIcon size={24} /> : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
