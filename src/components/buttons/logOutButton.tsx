"use client";

import { useAuth } from "@/src/context/userProvider";
import { useRouter } from "@/src/i18n/navigation";
import { supabaseClient } from "@/src/lib/supabase/client";
import { cn } from "@/src/lib/utils";
import { resetGlobalStore } from "@/src/store/global.store";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function LogoutButton({
  className,
  logo = "after",
}: {
  className?: string;
  logo?: "before" | "after" | "none";
}) {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut({ scope: "local" });
    resetGlobalStore();
    if (profile.role === "Team") {
      // resetPurchaseStore();
      // resetSupplierStore();
      // resetVerificationStore();
      // resetReferenceStore();
    }
    router.replace("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className={cn("flex h-fit w-full justify-between p-0", className)}
      aria-label={t("signout")}
    >
      {logo === "before" ? <LogOut size={24} /> : null}
      <span>{t("signout")}</span>
      {logo === "after" ? <LogOut size={24} /> : null}
    </Button>
  );
}
