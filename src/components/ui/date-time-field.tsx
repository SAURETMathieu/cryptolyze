import * as React from "react";
import * as DateTimeFieldPrimitive from "@/src/components/ui/date-time-field-primitive";
import {
  InputBase,
  InputBaseControl,
  InputBaseInput,
} from "@/src/components/ui/input-base";
import { cn } from "@/src/lib/utils";

export const DateTimeField = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DateTimeFieldPrimitive.Root>
>(({ children, className, ...props }, ref) => (
  <DateTimeFieldPrimitive.Root ref={ref} asChild {...props}>
    <InputBase className={cn("gap-0", className)}>{children}</InputBase>
  </DateTimeFieldPrimitive.Root>
));
DateTimeField.displayName = "DateTimeField";

export const DateTimeFieldSeparator = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DateTimeFieldPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DateTimeFieldPrimitive.Separator
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
));
DateTimeFieldSeparator.displayName = "DateTimeFieldSeparator";

export const DateTimeFieldYears = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldYears>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldYears
  >
>(({ placeholder = "yyyy", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldYears
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(4ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldYears>
  </InputBaseControl>
));
DateTimeFieldYears.displayName = "DateTimeFieldYears";

export const DateTimeFieldMonths = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldMonths>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldMonths
  >
>(({ placeholder = "mm", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldMonths
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldMonths>
  </InputBaseControl>
));
DateTimeFieldMonths.displayName = "DateTimeFieldMonths";

export const DateTimeFieldDays = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldDays>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldDays
  >
>(({ placeholder = "dd", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldDays
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldDays>
  </InputBaseControl>
));
DateTimeFieldDays.displayName = "DateTimeFieldDays";

export const DateTimeFieldHours = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldHours>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldHours
  >
>(({ placeholder = "--", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldHours
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldHours>
  </InputBaseControl>
));
DateTimeFieldHours.displayName = "DateTimeFieldHours";

export const DateTimeFieldMinutes = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldMinutes>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldMinutes
  >
>(({ placeholder = "--", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldMinutes
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldMinutes>
  </InputBaseControl>
));
DateTimeFieldMinutes.displayName = "DateTimeFieldMinutes";

export const DateTimeFieldSeconds = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldSeconds>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldSeconds
  >
>(({ placeholder = "--", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldSeconds
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 tabular-nums",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldSeconds>
  </InputBaseControl>
));
DateTimeFieldSeconds.displayName = "DateTimeFieldSeconds";

export const DateTimeFieldAmPm = React.forwardRef<
  React.ComponentRef<typeof DateTimeFieldPrimitive.DateTimeFieldAmPm>,
  React.ComponentPropsWithoutRef<
    typeof DateTimeFieldPrimitive.DateTimeFieldAmPm
  >
>(({ placeholder = "--", className, ...props }, ref) => (
  <InputBaseControl>
    <DateTimeFieldPrimitive.DateTimeFieldAmPm
      ref={ref}
      asChild
      placeholder={placeholder}
      {...props}
    >
      <InputBaseInput
        className={cn(
          "focus:bg-primary focus:text-primary-foreground focus:placeholder:text-primary-foreground box-content h-fit max-w-[calc(2ch_+_0.5rem)] flex-initial rounded-sm px-0.5 text-center",
          className
        )}
      />
    </DateTimeFieldPrimitive.DateTimeFieldAmPm>
  </InputBaseControl>
));
DateTimeFieldAmPm.displayName = "DateTimeFieldAmPm";
