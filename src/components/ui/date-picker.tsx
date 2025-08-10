"use client";

import * as React from "react";
import { buttonVariants } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  DateFieldDays,
  DateFieldMonths,
  DateFieldSeparator,
  DateFieldYears,
} from "@/src/components/ui/date-field";
import * as DatePickerPrimitive from "@/src/components/ui/date-picker-primitive";
import {
  InputBase,
  InputBaseAdornment,
  InputBaseAdornmentButton,
  InputBaseFlexWrapper,
} from "@/src/components/ui/input-base";
import { cn } from "@/src/lib/utils";
import { CalendarIcon, X } from "lucide-react";

export const DatePicker = DatePickerPrimitive.Root;

export const DatePickerAnchor = DatePickerPrimitive.Anchor;

const DatePickerInputBase = React.forwardRef<
  React.ComponentRef<typeof InputBase>,
  React.ComponentPropsWithoutRef<typeof InputBase>
>(({ children, ...props }, ref) => (
  <DatePickerAnchor asChild>
    <InputBase ref={ref} {...props}>
      <InputBaseFlexWrapper>{children}</InputBaseFlexWrapper>
      <InputBaseAdornment>
        <InputBaseAdornmentButton asChild>
          <DatePickerPrimitive.Clear>
            <span className="sr-only">Clear date</span>
            <X />
          </DatePickerPrimitive.Clear>
        </InputBaseAdornmentButton>
      </InputBaseAdornment>
      <InputBaseAdornment>
        <InputBaseAdornmentButton asChild>
          <DatePickerPrimitive.Trigger>
            <CalendarIcon />
          </DatePickerPrimitive.Trigger>
        </InputBaseAdornmentButton>
      </InputBaseAdornment>
    </InputBase>
  </DatePickerAnchor>
));
DatePickerInputBase.displayName = "DatePickerInputBase";

const DatePickerDateRangeField = React.forwardRef<
  React.ComponentRef<typeof DatePickerPrimitive.DateRangeField>,
  React.ComponentPropsWithoutRef<typeof DatePickerPrimitive.DateRangeField>
>(({ disabled: disabledProp, className, ...props }, ref) => {
  const { disabled } = DatePickerPrimitive.useDatePickerContext();

  return (
    <DatePickerPrimitive.DateRangeField
      ref={ref}
      disabled={disabled || disabledProp}
      className={cn("flex gap-1.5", className)}
      {...props}
    >
      <DatePickerPrimitive.DateRangeFieldFrom className="flex items-center">
        <DatePickerPrimitive.DateRangeFieldYears asChild>
          <DateFieldYears />
        </DatePickerPrimitive.DateRangeFieldYears>
        <DatePickerPrimitive.DateRangeFieldSeparator asChild>
          <DateFieldSeparator />
        </DatePickerPrimitive.DateRangeFieldSeparator>
        <DatePickerPrimitive.DateRangeFieldMonths asChild>
          <DateFieldMonths />
        </DatePickerPrimitive.DateRangeFieldMonths>
        <DatePickerPrimitive.DateRangeFieldSeparator asChild>
          <DateFieldSeparator />
        </DatePickerPrimitive.DateRangeFieldSeparator>
        <DatePickerPrimitive.DateRangeFieldDays asChild>
          <DateFieldDays />
        </DatePickerPrimitive.DateRangeFieldDays>
      </DatePickerPrimitive.DateRangeFieldFrom>

      <DatePickerPrimitive.DateRangeFieldSeparator>
        -
      </DatePickerPrimitive.DateRangeFieldSeparator>

      <DatePickerPrimitive.DateRangeFieldTo className="flex items-center">
        <DatePickerPrimitive.DateRangeFieldYears asChild>
          <DateFieldYears />
        </DatePickerPrimitive.DateRangeFieldYears>
        <DatePickerPrimitive.DateRangeFieldSeparator asChild>
          <DateFieldSeparator />
        </DatePickerPrimitive.DateRangeFieldSeparator>
        <DatePickerPrimitive.DateRangeFieldMonths asChild>
          <DateFieldMonths />
        </DatePickerPrimitive.DateRangeFieldMonths>
        <DatePickerPrimitive.DateRangeFieldSeparator asChild>
          <DateFieldSeparator />
        </DatePickerPrimitive.DateRangeFieldSeparator>
        <DatePickerPrimitive.DateRangeFieldDays asChild>
          <DateFieldDays />
        </DatePickerPrimitive.DateRangeFieldDays>
      </DatePickerPrimitive.DateRangeFieldTo>
    </DatePickerPrimitive.DateRangeField>
  );
});
DatePickerDateRangeField.displayName = "DatePickerDateRangeField";

const DatePickerDateField = React.forwardRef<
  React.ComponentRef<typeof DatePickerPrimitive.DateField>,
  React.ComponentPropsWithoutRef<typeof DatePickerPrimitive.DateField> & {
    locale?: "fr" | "en";
  }
>(({ disabled: disabledProp, className, locale = "en", ...props }, ref) => {
  const { disabled } = DatePickerPrimitive.useDatePickerContext();

  return (
    <DatePickerPrimitive.DateField
      ref={ref}
      disabled={disabled || disabledProp}
      className={cn("flex", className)}
      {...props}
    >
      {locale === "fr" ? (
        <>
          <DatePickerPrimitive.DateFieldDays asChild>
            <DateFieldDays placeholder={locale === "fr" ? "jj" : "dd"} />
          </DatePickerPrimitive.DateFieldDays>
          <DatePickerPrimitive.DateFieldSeparator asChild>
            <DateFieldSeparator />
          </DatePickerPrimitive.DateFieldSeparator>
          <DatePickerPrimitive.DateFieldMonths asChild>
            <DateFieldMonths placeholder={locale === "fr" ? "mm" : "dd"} />
          </DatePickerPrimitive.DateFieldMonths>
          <DatePickerPrimitive.DateFieldSeparator asChild>
            <DateFieldSeparator />
          </DatePickerPrimitive.DateFieldSeparator>
          <DatePickerPrimitive.DateFieldYears asChild>
            <DateFieldYears placeholder={locale === "fr" ? "aaaa" : "yyyy"} />
          </DatePickerPrimitive.DateFieldYears>
        </>
      ) : (
        <>
          <DatePickerPrimitive.DateFieldMonths asChild>
            <DateFieldMonths />
          </DatePickerPrimitive.DateFieldMonths>
          <DatePickerPrimitive.DateFieldSeparator asChild>
            <DateFieldSeparator />
          </DatePickerPrimitive.DateFieldSeparator>
          <DatePickerPrimitive.DateFieldDays asChild>
            <DateFieldDays />
          </DatePickerPrimitive.DateFieldDays>
          <DatePickerPrimitive.DateFieldSeparator asChild>
            <DateFieldSeparator />
          </DatePickerPrimitive.DateFieldSeparator>
          <DatePickerPrimitive.DateFieldYears asChild>
            <DateFieldYears />
          </DatePickerPrimitive.DateFieldYears>
        </>
      )}
    </DatePickerPrimitive.DateField>
  );
});
DatePickerDateField.displayName = "DatePickerDateField";

export const DatePickerInput = React.forwardRef<
  React.ComponentRef<
    typeof DatePickerDateField | typeof DatePickerDateRangeField
  >,
  React.ComponentPropsWithoutRef<
    typeof DatePickerDateField | typeof DatePickerDateRangeField
  >
>((props, ref) => {
  const { mode } = DatePickerPrimitive.useDatePickerContext();

  return (
    <DatePickerInputBase>
      {mode === "range" ? (
        <DatePickerDateRangeField
          ref={ref}
          {...(props as React.ComponentPropsWithoutRef<
            typeof DatePickerDateRangeField
          >)}
        />
      ) : (
        <DatePickerDateField
          ref={ref}
          {...(props as React.ComponentPropsWithoutRef<
            typeof DatePickerDateField
          >)}
        />
      )}
    </DatePickerInputBase>
  );
});
DatePickerInput.displayName = "DatePickerInput";

export const DatePickerTrigger = React.forwardRef<
  React.ComponentRef<typeof DatePickerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DatePickerPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <InputBase
    asChild
    className={cn(
      buttonVariants({ variant: "outline" }),
      "cursor-pointer font-normal",
      className
    )}
  >
    <DatePickerPrimitive.Trigger ref={ref} {...props}>
      <InputBaseAdornment>
        <CalendarIcon role="button" aria-label="Open date picker" />
      </InputBaseAdornment>
      <InputBaseFlexWrapper>{children}</InputBaseFlexWrapper>
    </DatePickerPrimitive.Trigger>
  </InputBase>
));
DatePickerTrigger.displayName = "DatePickerTrigger";

export const DatePickerValue = React.forwardRef<
  React.ComponentRef<typeof DatePickerPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof DatePickerPrimitive.Value>
>(({ className, ...props }, ref) => (
  <DatePickerPrimitive.Value
    ref={ref}
    className={cn("data-[placeholder]:text-muted-foreground/40", className)}
    {...props}
  />
));
DatePickerValue.displayName = "DatePickerValue";

export const DatePickerContent = React.forwardRef<
  React.ComponentRef<typeof DatePickerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DatePickerPrimitive.Content>
>(({ className, align = "start", alignOffset = 4, ...props }, ref) => (
  <DatePickerPrimitive.Portal>
    <DatePickerPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-[9999] max-h-96 w-auto overflow-hidden rounded-md border p-0 shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    />
  </DatePickerPrimitive.Portal>
));
DatePickerContent.displayName = "DatePickerContent";

export const DatePickerCalendar = (
  props: React.ComponentPropsWithoutRef<typeof Calendar>
) => (
  <DatePickerPrimitive.Calendar asChild>
    <Calendar {...props} />
  </DatePickerPrimitive.Calendar>
);
