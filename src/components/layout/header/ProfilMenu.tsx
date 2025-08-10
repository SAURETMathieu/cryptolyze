"use client";

import LogOutButton from "@/src/components/buttons/logOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/context/userProvider";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import NavigationLink from "@/components/link/NavigationLink";

export default function ProfilMenu() {
  const { profile } = useAuth();
  const t = useTranslations("Navbar");

  return profile ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:hover:bg-primary/20 overflow-hidden"
          aria-label={t("openUserMenuLabel")}
        >
          <div className="relative">
            <span
              className="absolute bottom-0 right-0 size-2 rounded-full bg-green-600"
              aria-label="User is online"
              role="status"
              aria-live="assertive"
            ></span>
            <UserRound size={24} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {profile?.email ?? "email@gmail.com"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavigationLink href="/profile" aria-label={t("ariaProfile")}>
          <DropdownMenuItem>{t("profileLinkLabel")}</DropdownMenuItem>
        </NavigationLink>
        <NavigationLink href="/contact" aria-label={t("ariaSupport")}>
          <DropdownMenuItem>{t("supportLinkLabel")}</DropdownMenuItem>
        </NavigationLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="overflow-hidden dark:border-none"
        >
          <div className="relative">
            <span
              className="absolute bottom-0 right-0 size-2 rounded-full bg-red-600"
              aria-label="User is offline"
              role="status"
              aria-live="assertive"
            ></span>
            <UserRound size={24} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <NavigationLink href="/contact" aria-label={t("ariaSupport")}>
          <DropdownMenuItem>{t("supportLinkLabel")}</DropdownMenuItem>
        </NavigationLink>
        <DropdownMenuSeparator />
        <NavigationLink href="/login" aria-label={t("ariaSignin")}>
          <DropdownMenuItem>{t("signin")}</DropdownMenuItem>
        </NavigationLink>
        <NavigationLink href="/signup" aria-label={t("ariaSignup")}>
          <DropdownMenuItem>{t("signup")}</DropdownMenuItem>
        </NavigationLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
