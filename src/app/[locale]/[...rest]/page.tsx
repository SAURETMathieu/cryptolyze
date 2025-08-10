"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { ArrowLeft, Footprints } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CatchAllPage() {
  const router = useRouter();
  const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="mt-[-150px] flex flex-col items-center justify-center">
        <Footprints className="text-primary mb-6 size-20" />
        <h1 className="text-foreground mb-1 text-3xl font-bold tracking-tight">
          {t("404Title")}
        </h1>
        <p className="text-muted-foreground mb-4 max-w-md text-lg">
          {t("404Description")}
        </p>
        <Button
          size="lg"
          className="group text-base"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
          {t("404Button")}
        </Button>
      </div>
    </div>
  );
}
