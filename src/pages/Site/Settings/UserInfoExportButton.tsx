"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function UserInfoExportButton() {
  const tSettings = useTranslations("SettingsPage");

  const handleGetUserInfo = async () => {
    //TODO get user info logic
  };

  return (
    <Button variant="primary" disabled className="w-full">
      {tSettings("getUserInfo")}
    </Button>
  );
}
