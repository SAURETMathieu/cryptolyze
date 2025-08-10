import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import ButtonBackToLastUrl from "@/src/components/buttons/ButtonBackToLastUrl";
import BreadcrumbSection from "@/src/components/layout/BreadcrumbSection";
import { createServer } from "@/src/lib/supabase/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import AdminSidebar from "./AdminSideBar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return notFound();
  }

  const isAdminUser = data?.role === "Team";

  if (!isAdminUser) redirect("/");

  return (
    <NuqsAdapter>
      <div className="max-h-main flex">
        <AdminSidebar />
        <main className="admin-layout w-full flex-1 overflow-y-auto p-6">
          <nav className="mb-4 flex items-center gap-4">
            <ButtonBackToLastUrl />
            <BreadcrumbSection homePath="/admin" />
          </nav>
          {children}
        </main>
      </div>
    </NuqsAdapter>
  );
}
