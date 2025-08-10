"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadIcon } from "@/components/icons/LoadIcon";

import AutoFormObject from "./fields/object";
import { Dependency, FieldConfig } from "./types";
import {
  getDefaultValues,
  getObjectFormSchema,
  ZodObjectOrWrapped,
} from "./utils";

export function AutoFormSubmit({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button type="submit" disabled={disabled} className={className}>
      {children ?? "Submit"}
    </Button>
  );
}

export function AutoFormReset({
  children,
  className,
  disabled,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children ?? "Reset"}
    </Button>
  );
}

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
  dependencies,
  closeSheet,
  isDisabled = false,
  submitButtonValue = "Submit",
  resetButtonValue = "Reset",
}: {
  formSchema: SchemaType;
  values?: Partial<z.infer<SchemaType>>;
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onSubmit?: (values: z.infer<SchemaType>) => void;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  children?: React.ReactNode;
  className?: string;
  dependencies?: Dependency<z.infer<SchemaType>>[];
  closeSheet?: () => void;
  isDisabled?: boolean;
  submitButtonValue?: string;
  resetButtonValue?: string;
}) {
  const objectFormSchema = getObjectFormSchema(formSchema);
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> =
    valuesProp || getDefaultValues(objectFormSchema, fieldConfig) || {};
  getDefaultValues(objectFormSchema, fieldConfig);

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    values: valuesProp || defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onSubmitProp?.(parsedValues.data);
    }
  }

  const values = form.watch();
  const valuesString = JSON.stringify(values);

  React.useEffect(() => {
    onValuesChangeProp?.(values);
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onParsedValuesChange?.(parsedValues.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesString]);

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            form.handleSubmit(onSubmit)(e);
          }}
          className={cn("space-y-5", className)}
          noValidate
        >
          <AutoFormObject
            schema={objectFormSchema}
            form={form}
            dependencies={dependencies}
            fieldConfig={fieldConfig}
            isDisabled={isDisabled}
          />

          {children}
          <div className="flex w-full justify-between gap-2">
            <AutoFormReset
              onClick={() => form.reset(defaultValues)}
              className="w-[45%]"
              disabled={isDisabled}
            >
              {resetButtonValue}
            </AutoFormReset>
            <AutoFormSubmit disabled={isDisabled} className="w-[45%]">
              {isDisabled ? <LoadIcon size={24} /> : submitButtonValue}
            </AutoFormSubmit>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AutoForm;
