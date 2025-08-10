import * as z from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export default function AutoFormRadioGroupCards({
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
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="address">
            <AccordionTrigger>
              <div className="w-full cursor-pointer text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {fieldConfigItem?.label || label}
                {fieldProps?.required && (
                  <span className="text-destructive"> *</span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...fieldProps}
                  className="m-0 flex flex-col justify-center gap-2 p-4"
                >
                  {values?.map((item: any) => (
                    <FormItem
                      key={item?.id}
                      className={`hover:ring-ring hover:border-primary hover:bg-muted-foreground/10 relative flex w-full cursor-pointer items-center justify-center space-y-0 rounded-lg border
                                    ${String(field.value) === String(item?.id) ? "ring-ring ring" : ""}`}
                    >
                      <FormControl className="absolute left-0 top-0 size-full rounded-none border-0">
                        <RadioGroupItem
                          value={item?.id}
                          className="absolute size-full opacity-0"
                        />
                      </FormControl>
                      <FormLabel className="w-full">{item}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <FormMessage />
      </FormItem>

      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
    </div>
  );
}
