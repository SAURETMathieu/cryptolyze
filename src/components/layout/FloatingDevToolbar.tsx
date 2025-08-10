"use client";

import { useState } from "react";
import DevColorsModal from "@/src/dev/DevColorsModal";
import DevModal from "@/src/dev/DevModal";
import DevStoresModal from "@/src/dev/DevStoresModal";
import { useGlobalStore } from "@/src/store/global.store";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FloatingToolbar() {
  const isDevMode = process.env.NODE_ENV === "development";
  const [isExpanded, setIsExpanded] = useState(false);
  const currentForm = useGlobalStore((state) => state.currentForm);

  if (!isDevMode) return null;
  return (
    <div className="floating-toolbar pointer-events-auto fixed bottom-4 right-4 z-[9999]">
      <div
        className={`bg-background border-primary ring-primary/20 rounded-lg shadow-lg ring-1 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-auto px-2" : "w-12"
        }`}
      >
        <div className="flex h-12 items-center justify-center">
          {isExpanded ? (
            <>
              <DevModal
                datas={currentForm}
                className="static size-10 rounded-lg border-none"
                disabled={currentForm === null || currentForm?.length === 0}
                title={`Forms datas (${currentForm?.length})`}
                canEdit={false}
                canDelete={false}
              />
              <DevStoresModal
                className="static size-10 rounded-lg border-none"
                collapseDepth={2}
              />
              <DevColorsModal className="static size-10 rounded-lg border-none" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="rounded-lg"
                aria-label="Collapse toolbar"
              >
                <Menu className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="rounded-lg"
              aria-label="Expand toolbar"
            >
              <Menu className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
