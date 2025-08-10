"use client";

import NavigationLink from "@/src/components/link/NavigationLink";
import { useAuth } from "@/src/context/userProvider";
import { BadgeCheck, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

import { H1 } from "@/components/ui/titles";

import ProfileNav from "./ProfileNav";

type PageProps = {
  params: { locale: string };
  children: ReactNode;
};
export default function ProfileLayout(props: PageProps) {
  const { children } = props;

  const t = useTranslations("ProfilePage");
  const { profile, isVerified } = useAuth();
  const [loading, setLoading] = useState(true);

  return (
    <main className="min-h-main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <NavigationLink
          href="/profile"
          className="hover:text-accent-foreground text-muted-foreground flex items-center gap-2 text-sm uppercase"
        >
          <ChevronLeft />
          {t("back")}
        </NavigationLink>
        <div className="flex items-center gap-4">
          <H1 className="py-4">{t("myAccount")}</H1>
          {isVerified && <BadgeCheck size={24} className="text-green-600" />}
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr]">
        <ProfileNav />
        <section className="no-scrollbar flex max-h-[main] flex-1 flex-col gap-6 overflow-y-scroll px-1">
          {children}
        </section>
      </div>
    </main>
  );
}
