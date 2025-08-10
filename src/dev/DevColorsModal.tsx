"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { cn } from "@/src/lib/utils";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/buttons/themeToggle";

interface DevColorsModalProps {
  title?: string;
  className?: string;
}

export default function DevColorsModal({
  title = "Colors",
  className,
}: DevColorsModalProps) {
  const [open, setOpen] = useState(false);
  const colors = [
    { name: "Primary", value: "bg-primary" },
    { name: "Primary Foreground", value: "bg-primary-foreground" },
    { name: "Secondary", value: "bg-secondary" },
    { name: "Secondary Foreground", value: "bg-secondary-foreground" },
    { name: "Accent", value: "bg-accent" },
    { name: "Accent Foreground", value: "bg-accent-foreground" },
    { name: "Muted", value: "bg-muted" },
    { name: "Muted Foreground", value: "bg-muted-foreground" },
    { name: "Destructive", value: "bg-destructive" },
    { name: "Destructive Foreground", value: "bg-destructive-foreground" },
    { name: "Border", value: "bg-border" },
    { name: "Input", value: "bg-input" },
    { name: "Background", value: "bg-background" },
    { name: "Card", value: "bg-card" },
    { name: "Card Foreground", value: "bg-card-foreground" },
    { name: "Popover", value: "bg-popover" },
    { name: "Popover Foreground", value: "bg-popover-foreground" },
    { name: "Ring", value: "bg-ring" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "hover:bg-muted absolute left-0 top-0 size-5 rounded-none hover:ring-0",
            className
          )}
        >
          <Palette size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] min-h-[500px] w-fit min-w-[340px] max-w-[85vw] resize flex-col gap-0 overflow-auto p-0">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-border mb-1 flex items-center justify-between border-b px-6 py-4 pr-12">
            {title}
            <ThemeToggle />
          </DialogTitle>
          <DialogDescription className="w-[300px]">
            {colors.map((color) => (
              <div
                className="inline-flex w-full items-center justify-start gap-4 whitespace-nowrap px-6 py-1 font-medium"
                key={color.name}
              >
                <div
                  className={cn(
                    "size-6 overflow-hidden rounded border",
                    color.value
                  )}
                ></div>
                <span className="">{color.name}</span>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 overflow-y-auto">
          <DialogDescription
            className="text-primary p-6"
            asChild
          ></DialogDescription>
        </div>
        <DialogFooter className="border-border mt-1 border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button">Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
