import { Metadata } from "next";
import { AdminHeaderPages } from "@/src/components/layout/AdminHeaderPages";

import MenuCardItem from "../MenuCardItem";
import { adminNavItems } from "../navbarConfig";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Administration",
  };
}

export default function AdminAdministrationMenuPage() {
  const subItemsMenu =
    adminNavItems.find((item) => item.label === "Administration")?.subItems ||
    [];

  return (
    <>
      <AdminHeaderPages
        title="Administration"
        description="Menu Administration"
      />
      <section className="grid grid-cols-3 gap-8">
        {subItemsMenu.map((item) => (
          <MenuCardItem key={item.label} subItem={item} />
        ))}
      </section>
    </>
  );
}
