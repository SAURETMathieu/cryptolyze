"use client";

import { useRouter } from "@/src/i18n/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonBackToLastUrl() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-7"
      type="button"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
