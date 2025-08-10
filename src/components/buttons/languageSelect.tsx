"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { updateLanguage } from "@/src/app/actions/profile";
import { useAuth } from "@/src/context/userProvider";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons/icons";

function LanguageSection() {
  const locale = useLocale();
  const t = useTranslations("ThemeSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { profile, setProfile } = useAuth();

  const searchParams = useSearchParams();
  const queryObject = Object.fromEntries(searchParams.entries());

  const handleLanguage = async (newLanguage: string) => {
    router.replace(
      //@ts-expect-error
      { pathname, params, query: queryObject },
      { locale: newLanguage }
    );
  };

  useEffect(() => {
    const updateLocale = () => {
      if (profile && locale && locale !== profile.language) {
        updateLanguage(locale as "fr" | "en");
        setProfile({ ...profile, language: locale as "fr" | "en" });
      }
    };
    updateLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const currentFlagIcon =
    locale === "fr" ? (
      <Icons.frenchFlag className="size-6 rounded-lg" />
    ) : (
      <Icons.britishFlag className="size-6 rounded-lg" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className=""
        >
          {currentFlagIcon}
          <span className="sr-only">{t("ariaLangage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguage("fr")}
          aria-label={t("ariaFrench")}
          className="hover:bg-accent hover:text-accent-foreground flex gap-4 hover:cursor-pointer"
        >
          <Icons.frenchFlag className="size-6 rounded-lg" />
          Français
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguage("en")}
          aria-label={t("ariaEnglish")}
          className="hover:bg-accent hover:text-accent-foreground flex gap-4 hover:cursor-pointer"
        >
          <Icons.britishFlag className="size-6 rounded-lg" />
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSection;
