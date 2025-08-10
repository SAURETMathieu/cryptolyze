"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    getColor?: (value: number) => string;
  }
>(({ className, value, getColor, ...props }, ref) => {
  const backgroundColor = getColor
    ? getColor(value || 0)
    : (value || 0) < 50
      ? "bg-green-700"
      : (value || 0) > 80
        ? "bg-red-500"
        : "bg-orange-500";

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "bg-secondary relative h-4 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("wave size-full flex-1 transition-all", backgroundColor)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
