import * as z from "zod";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItemSize } from "@/components/ui/radio-group";

import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export default function AutoFormRadioGroupSize({
  label,
  isRequired,
  field,
  zodItem,
  fieldProps,
  fieldConfigItem,
}: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: string[] = [];
  if (!Array.isArray(baseValues)) {
    values = Object.entries(baseValues).map((item) => item[0]);
  } else {
    values = baseValues;
  }

  return (
    <div>
      <FormItem>
        <div className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {fieldConfigItem?.label || label}
          {fieldProps?.required && <span className="text-destructive"> *</span>}
        </div>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            {...fieldProps}
            className="m-0 flex flex-wrap justify-center gap-2"
          >
            {values?.map((value: any) => (
              <FormItem
                key={value}
                className={`hover:bg-primary hover:text-primary-foreground relative  flex size-[50px] min-w-[50px] cursor-pointer items-center justify-center space-y-0 rounded-lg border md:size-[55px] md:min-w-[55px]
                  ${field.value === value ? "bg-primary text-primary-foreground" : "bg-background"}`}
              >
                <FormControl className="absolute left-0 top-0 size-full rounded-none border-0">
                  <RadioGroupItemSize value={value} className="" />
                </FormControl>
                <FormLabel className="m-0 flex size-full items-center justify-center font-normal">
                  {value}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
    </div>
  );
}
