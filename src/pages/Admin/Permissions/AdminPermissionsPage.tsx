"use client";

import { useEffect, useState, useTransition } from "react";
import {
  initRolePermissions,
  updateExecuteFunction,
  updatePermissions,
  updateSchemasPermissions,
} from "@/src/app/actions/admin/permissions";
import {
  getFunctionsPrivileges,
  getSchemasPrivileges,
  getTablesPrivileges,
} from "@/src/app/actions/admin/roles";
import { CreateNewRoleForm } from "@/src/components/forms/admin/RoleForms/NewRole";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useModal } from "@/src/context/modalProvider";
import FunctionPermissions from "@/src/pages/Admin/Permissions/FunctionPermissions";
import RoleSelector from "@/src/pages/Admin/Permissions/RoleSelector";
import SchemaPermissions from "@/src/pages/Admin/Permissions/SchemaPermissions";
import SchemaSelector from "@/src/pages/Admin/Permissions/SchemaSelector";
import TablePermissions from "@/src/pages/Admin/Permissions/TablePermissions";
import { getObjectChangesFunction } from "@/src/utils/compare/getObjectChangesFunction";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  FunctionPrivilegesType,
  RoleType,
  SchemaPrivilegesType,
  SchemaType,
  TablePrivilegesType,
} from "@/types/admin/role";

export default function AdminPermissionsMain({
  schemas,
  roles,
}: {
  schemas: SchemaType[];
  roles: RoleType[];
}) {
  const [selectedRole, setSelectedRole] = useState("authenticated");
  const [selectedSchema, setSelectedSchema] = useState("public");
  const [activeTab, setActiveTab] = useState("tables");

  const [tablesPermissions, setTablesPermissions] = useState<
    TablePrivilegesType[]
  >([]);
  const [functionsPermissions, setFunctionsPermissions] = useState<
    FunctionPrivilegesType[]
  >([]);
  const [schemasPermissions, setSchemasPermissions] = useState<
    SchemaPrivilegesType[]
  >([]);

  const [initialTables, setInitialTables] = useState<TablePrivilegesType[]>([]);
  const [initialFunctions, setInitialFunctions] = useState<
    FunctionPrivilegesType[]
  >([]);
  const [initialSchemas, setInitialSchemas] = useState<SchemaPrivilegesType[]>(
    []
  );

  const [isPending, startTransition] = useTransition();
  const [isSubmit, startTransitionSubmit] = useTransition();

  const [rolesState, setRolesState] = useState<RoleType[]>(roles);

  const { openModal } = useModal();

  useEffect(() => {
    if (activeTab === "tables") {
      fetchTablesPermissions(selectedSchema, selectedRole);
    }
  }, [selectedSchema, selectedRole, activeTab]);

  useEffect(() => {
    if (activeTab === "functions") {
      fetchFunctionsPermissions(selectedSchema, selectedRole);
    }
  }, [selectedSchema, selectedRole, activeTab]);

  useEffect(() => {
    if (activeTab === "schemas") {
      fetchSchemasPermissions(selectedRole);
    }
  }, [selectedRole, activeTab]);

  const fetchTablesPermissions = async (schema: string, role: string) => {
    startTransition(async () => {
      try {
        const { success, data, message } = await getTablesPrivileges(
          schema,
          role
        );
        if (success) {
          setTablesPermissions(data as TablePrivilegesType[]);
          setInitialTables(data as TablePrivilegesType[]);
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };

  const fetchFunctionsPermissions = async (schema: string, role: string) => {
    startTransition(async () => {
      try {
        const { success, data, message } = await getFunctionsPrivileges(
          schema,
          role
        );
        if (success) {
          setFunctionsPermissions(data);
          setInitialFunctions(data);
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };

  const fetchSchemasPermissions = async (role: string) => {
    startTransition(async () => {
      try {
        const { success, data, message } = await getSchemasPrivileges(role);
        if (success) {
          setSchemasPermissions(data);
          setInitialSchemas(data);
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    });
  };

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const handleResetChanges = () => {
    if (activeTab === "functions") {
      setFunctionsPermissions(initialFunctions);
      return;
    }
    if (activeTab === "tables") {
      setTablesPermissions(initialTables);
      return;
    }
    if (activeTab === "schemas") {
      setSchemasPermissions(initialSchemas);
      return;
    }
  };

  const handleSaveChanges = async () => {
    startTransitionSubmit(async () => {
      let changes: { [key: string]: string | boolean }[] = [];
      switch (activeTab) {
        case "tables":
          changes = getObjectChangesFunction<TablePrivilegesType>(
            initialTables,
            tablesPermissions,
            "table_name",
            "table_name"
          );
          const updatePermissionSuccess = await updatePermissions(changes);
          if (updatePermissionSuccess.success) {
            toast.success("Permissions updated");
            const cleanedPermissions = tablesPermissions.map((permission) => {
              const cleanedPermission: any = { ...permission };
              delete cleanedPermission.table_name;
              delete cleanedPermission.role_name;
              delete cleanedPermission.schema_name;
              return cleanedPermission;
            });
            setInitialTables(cleanedPermissions);
          } else {
            toast.error("Error updating permissions");
          }
          break;

        case "functions":
          changes = getObjectChangesFunction<FunctionPrivilegesType>(
            initialFunctions,
            functionsPermissions,
            "function_name",
            "function_name"
          );
          const updateFunctionSuccess = await updateExecuteFunction(changes);
          if (updateFunctionSuccess.success) {
            const cleanedFunctionsPermissions = functionsPermissions.map(
              (permission) => {
                const cleanedFunctionsPermissions: any = { ...permission };
                delete cleanedFunctionsPermissions.role_name;
                delete cleanedFunctionsPermissions.schema_name;
                return cleanedFunctionsPermissions;
              }
            );
            toast.success("Function permissions updated");
            setInitialFunctions(cleanedFunctionsPermissions);
          } else {
            toast.error("Error updating function permissions");
          }
          break;

        case "schemas":
          changes = getObjectChangesFunction<SchemaPrivilegesType>(
            initialSchemas,
            schemasPermissions,
            "schema_name",
            "schema_name"
          );
          const updateSchemasSuccess = await updateSchemasPermissions(changes);
          if (updateSchemasSuccess.success) {
            const cleanedSchemasPermissions = schemasPermissions.map(
              (permission) => {
                const cleanedSchemasPermissions: any = { ...permission };
                delete cleanedSchemasPermissions.role_name;
                return cleanedSchemasPermissions;
              }
            );
            toast.success("Schemas permissions updated");
            setInitialSchemas(cleanedSchemasPermissions);
          } else {
            toast.error("Error updating schemas permissions");
          }
          break;
      }
    });
  };

  const handleInitRolePermissions = async () => {
    try {
      const success = await initRolePermissions(
        ["public", "erp"],
        selectedRole
      );
      if (success) {
        toast.success("Role permissions initialized");
      } else {
        toast.error("Error initializing role permissions");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCreateRole = async () => {
    openModal(<CreateNewRoleForm setRolesState={setRolesState} />);
  };

  return (
    <Card className="bg-background border-none p-0 shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Permissions</CardTitle>
        <CardDescription>Manage roles and permissions</CardDescription>
        <div className="flex w-full gap-4">
          <RoleSelector
            roles={rolesState}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />
          <SchemaSelector
            schemas={schemas}
            selectedSchema={selectedSchema}
            onSchemaChange={setSelectedSchema}
          />
          <div className="flex items-end">
            <Button onClick={handleCreateRole}>
              <span className="flex items-center justify-between gap-2">
                {<Plus className="size-4" />}
                Add role
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-fit max-w-full space-y-6 overflow-x-auto p-0">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="border-input gap-2 rounded-lg border">
            <TabsTrigger className="hover:bg-muted rounded-lg" value="tables">
              Tables
            </TabsTrigger>
            <TabsTrigger
              className="hover:bg-muted rounded-lg"
              value="functions"
            >
              Functions
            </TabsTrigger>
            <TabsTrigger className="hover:bg-muted rounded-lg" value="schemas">
              Schemas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tables" className="w-fit max-w-full">
            <TablePermissions
              permissions={tablesPermissions}
              currentRole={selectedRole}
              currentSchema={selectedSchema}
              setTablesPermissions={setTablesPermissions}
              isPending={isPending}
            />
          </TabsContent>
          <TabsContent value="functions">
            <FunctionPermissions
              permissions={functionsPermissions}
              currentRole={selectedRole}
              currentSchema={selectedSchema}
              setFunctionsPermissions={setFunctionsPermissions}
              isPending={isPending}
            />
          </TabsContent>
          <TabsContent value="schemas">
            <SchemaPermissions
              permissions={schemasPermissions}
              currentRole={selectedRole}
              setSchemasPermissions={setSchemasPermissions}
              isPending={isPending}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-4">
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
      </CardContent>
    </Card>
  );
}
