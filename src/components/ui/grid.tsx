import * as React from "react";
import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
