"use client";

import NavigationLink from "@/src/components/link/NavigationLink";
import { useAuth } from "@/src/context/userProvider";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfileNav() {
  const { headerHeight } = useAuth();
  const t = useTranslations("ProfilePage");

  return (
    <nav
      id="account-nav"
      className="bg-background no-scrollbar z-30 flex gap-4 overflow-y-scroll py-2 text-sm md:flex-col"
      style={{
        position: "sticky",
        top: headerHeight,
      }}
    >
      <NavigationLink
        className="hover:text-accent-foreground hover:border-foreground flex min-w-[250px] items-center justify-between gap-2 rounded-[5px] border p-4 "
        href="/profile/account"
      >
        <div className="flex items-center gap-2">
          <User />
          {t("myInfos")}
        </div>
        <div className="font-bold">100%</div>
      </NavigationLink>
    </nav>
  );
}
