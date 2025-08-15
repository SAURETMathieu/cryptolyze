import { Metadata } from "next";
import { EmailsPage } from "@/src/pages/Admin/Emails/EmailsManager";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration - Emails",
  };
}

export default async function AdminEmailsPage() {
  return <EmailsPage />;
}
