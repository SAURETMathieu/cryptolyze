"use client";

import { cn } from "@/src/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipElementProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function TooltipElement({
  trigger,
  content,
  contentClassName,
  side,
  sideOffset,
  align,
  alignOffset,
  delayDuration = 100,
  open,
  onOpenChange,
  defaultOpen,
}: TooltipElementProps) {
  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={delayDuration}
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
      >
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          className={cn(
            "border-primary/70 bg-muted rounded-lg border p-3 shadow-md",
            contentClassName
          )}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
