"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/src/components/icons/icons";
import { usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const [showFooter, setShowFooter] = useState(true);
  const pathName = usePathname();
  const date = new Date();
  const year = date.getFullYear();
  const tFooter = useTranslations("Footer");

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/admin")) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
    };

    handleRouteChange(pathName);
  }, [pathName]);

  if (!showFooter) {
    return null;
  }

  return (
    <footer className="flex w-full flex-col border-t items-center justify-center gap-2 bg-card p-10 text-current">
      <p>© {year} Mathieu SAURET </p>
      <p className="mb-4">{tFooter("text1")}</p>
      <p>{tFooter("text2")}</p>
      <div className="flex justify-center">
        <span className="m-1 mt-2 inline-flex items-center gap-2 rounded border bg-foreground/20 p-1 text-xs font-bold">
          React
          <Icons.react className="inline size-4" />
        </span>
        <span className="m-1 mt-2 inline-flex items-center gap-2 rounded border bg-foreground/20 p-1 text-xs font-bold">
          Tailwind
          <Icons.tailwind className="inline size-4" />
        </span>
        <span className="m-1 mt-2 inline-flex items-center gap-2 rounded border bg-foreground/20 p-1 text-xs font-bold">
          Next.js
          <Icons.next className="inline size-4" />
        </span>
      </div>
    </footer>
  );
}
