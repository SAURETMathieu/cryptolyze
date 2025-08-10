"use client";

import * as z from "zod";

import { cn } from "@/lib/utils";
import CountrySelect from "@/components/ui/countrySelect";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: [string, string][] = [];
  if (
    Array.isArray(fieldConfigItem?.inputProps?.options) &&
    fieldConfigItem?.inputProps?.options.length > 0
  ) {
    values = fieldConfigItem.inputProps.options.map((item) => [
      item.value,
      item.label,
    ]);
  } else {
    if (!Array.isArray(baseValues)) {
      values = Object.entries(baseValues);
    } else {
      values = baseValues.map((value) => [value, value]);
    }
  }

  function findItem(value: any) {
    return values.find((item) => item[0] === value);
  }

  const type = fieldProps.type || "text";

  return (
    <FormItem className="flex flex-col justify-center space-y-2">
      {fieldConfigItem?.label && (
        <AutoFormLabel label={fieldConfigItem?.label} isRequired={isRequired} />
      )}

      <FormControl>
        {type === "country" ? (
          <CountrySelect
            field={field}
            fieldConfigItem={fieldConfigItem}
            fieldProps={fieldProps}
          />
        ) : (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            {...fieldProps}
          >
            <SelectTrigger
              className={cn(
                "border-primary/40 hover:ring-ring border hover:ring-1",
                fieldProps.className
              )}
            >
              <SelectValue
                placeholder={fieldConfigItem.inputProps?.placeholder}
              >
                {field.value
                  ? `${findItem(field.value)?.[1] || ""} ${fieldProps?.addingText || ""}`
                  : "Select an option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {values.map(([value, label]) => (
                <SelectItem value={value} key={value} className="capitalize">
                  {label} {fieldProps?.addingText || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
