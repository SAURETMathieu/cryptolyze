import { Metadata } from "next";
import { TriggersPage } from "@/src/pages/Admin/Triggers/TriggersManager";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration - Triggers",
  };
}

export default async function AdminTriggersPage() {
  return <TriggersPage />;
}
