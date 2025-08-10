import { Metadata } from "next";
import { EmailsPage } from "@/src/components/pages/Admin/Emails/EmailsManager";
import { createServer } from "@/src/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration - Emails",
  };
}

export default async function AdminEmailsPage() {
  return <EmailsPage />;
}
