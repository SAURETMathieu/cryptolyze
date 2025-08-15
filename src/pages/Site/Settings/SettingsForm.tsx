"use client";

import { updateLanguage } from "@/src/app/actions/profile";
import { useAuth } from "@/src/context/userProvider";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Icons } from "@/components/icons/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";
import { Switch } from "@/components/ui/switch";

import DeleteAccountDialog from "./DeleteAccountDialog";

export default function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryObject = Object.fromEntries(searchParams.entries());
  const { profile, setProfile } = useAuth();
  const tSettings = useTranslations("SettingsPage");

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLanguage = async (newLanguage: string) => {
    router.replace(
      {
        pathname: pathname as any,
        query: queryObject,
      },
      { locale: newLanguage },
    );
  };

  useEffect(() => {
    const updateLocale = async () => {
      if (profile && locale && locale !== profile.language) {
        updateLanguage(locale as "fr" | "en");
        setProfile({ ...profile, language: locale as "fr" | "en" });
      }
    };
    updateLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <form className="space-y-8">
      <Card className="p-2">
        <CardHeader>
          <CardTitle>{tSettings("apparence")}</CardTitle>
          <CardDescription>{tSettings("customizeLooksApp")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">{tSettings("darkMode")}</Label>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="p-2">
        <CardHeader>
          <CardTitle>{tSettings("accountPreferences")}</CardTitle>
          <CardDescription>
            {tSettings("manageSettingsAndNotifications")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">
              {tSettings("emailNotifications")}
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div> */}
          <div className="space-y-1">
            <Label htmlFor="language">{tSettings("language")}</Label>
            <Select value={locale} onValueChange={handleLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <span className="flex items-center gap-4">
                    <Icons.britishFlag className="size-6 rounded-lg" />
                    {tSettings("english")}
                  </span>
                </SelectItem>
                <SelectItem value="fr">
                  <span className="flex items-center gap-4">
                    <Icons.frenchFlag className="size-6 rounded-lg" />
                    {tSettings("french")}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="p-2">
        <CardHeader>
          <CardTitle>{tSettings("accountManagement")}</CardTitle>
          <CardDescription>{tSettings("accountInfosOrDelete")}</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-wrap gap-4">
          {/* <UserInfoExportButton /> */}
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </form>
  );
}
