"use client";

import { useTranslations } from "next-intl";

import SettingsForm from "./SettingsForm";

export function SettingsMain() {
  const tSettings = useTranslations("SettingsPage");
  return (
    <div className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold">{tSettings("title")}</h1>
        </header>
        <SettingsForm />
      </div>
    </div>
  );
}
