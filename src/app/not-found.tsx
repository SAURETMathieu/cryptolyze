"use client";

import { ChevronLeft } from "lucide-react";
import Error from "next/error";
import { useRouter } from "next/navigation";

import { Button } from "../components/ui/button";

export default function NotFound() {
  const router = useRouter();
  return (
    <html lang="fr">
      <body>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="default"
            size="icon"
            className="border-primary-foreground text-primary-foreground size-7 border"
            type="button"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <Error statusCode={404} />
        </div>
      </body>
    </html>
  );
}
