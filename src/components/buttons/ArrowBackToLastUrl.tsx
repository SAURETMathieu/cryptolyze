"use client";

import { useRouter } from "@/src/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default function ArrowBackToLastUrl() {
  const router = useRouter();
  return (
    <div
      className="hover:text-accent-foreground text-muted-foreground flex cursor-pointer items-center gap-2 text-sm uppercase"
      onClick={() => router.back()}
    >
      <ArrowLeft
        size={32}
        className="text-foreground hover:text-foreground/80 absolute left-4 top-4 transition-transform duration-200 hover:scale-110 md:left-12"
      />
    </div>
  );
}
