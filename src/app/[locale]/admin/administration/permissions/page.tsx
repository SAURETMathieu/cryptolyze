import { Metadata } from "next";
import { getRoles, getSchemas } from "@/src/app/actions/admin/roles";
import AdminPermissionsMain from "@/src/components/pages/Admin/Permissions/AdminPermissionsPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration - Permissions",
  };
}

export default async function AdminPermissionsPage() {
  const {
    success: schemaSuccess,
    data: schemas,
    message: schemaMessage,
  } = await getSchemas();

  const {
    success: roleSuccess,
    data: roles,
    message: roleMessage,
  } = await getRoles();

  return <AdminPermissionsMain schemas={schemas} roles={roles} />;
}
