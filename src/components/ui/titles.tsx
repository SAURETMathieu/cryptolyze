import * as React from "react";
import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
  ({ children, className, ...props }, ref) => {
    return (
      <h1
        className={cn(
          "scroll-m-20 py-12 text-3xl font-extrabold tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

H1.displayName = "H1";

export interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2
        className={cn(
          "scroll-m-10 py-2 text-xl font-semibold tracking-tight first:mt-0",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

H2.displayName = "H2";

export { H1, H2 };
