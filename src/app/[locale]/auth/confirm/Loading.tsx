"use client";

import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("EmailVerifyPage");
  return (
    <main className="min-h-main max-h-main mt-20 flex-1">
      <h1 className="my-auto w-full p-6 text-center text-lg md:text-2xl">
        {t("loadingVerifySession")}
      </h1>
      <div className="mx-auto w-fit">
        <LoadIcon size={48} />
      </div>
    </main>
  );
}
