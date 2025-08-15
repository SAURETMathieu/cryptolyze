"use client";

import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function HomeMain() {
  const t = useTranslations("IndexPage");
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => toast.error("Error")}>Error Alert</Button>
        <Button onClick={() => toast.success("Success")}>Success Alert</Button>
        <Button onClick={() => toast.loading("Loading")}>Loading Alert</Button>
      </div>
    </section>
  );
}
