import React from "react";
import { useLocale } from "next-intl";
import en from "react-phone-number-input/locale/en.json";
import fr from "react-phone-number-input/locale/fr.json";

import {
  FormControl,
  FormControlPassword,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phoneNumber";

import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";

const AutoFormInput = React.memo(function AutoFormInput({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const type = fieldProps.type || "text";
  const locale = useLocale();

  return (
    <div className="flex flex-row items-center space-x-2">
      <FormItem className="flex w-full flex-col justify-start">
        {showLabel && (
          <AutoFormLabel
            label={fieldConfigItem?.label || label}
            isRequired={isRequired}
          />
        )}
        {type === "phone" ? (
          <FormControl>
            <PhoneInput
              international
              defaultCountry="FR"
              placeholder={fieldProps.placeholder ?? "Enter a phone number"}
              labels={locale === "fr" ? fr : en}
              className="border-primary/40 hover:ring-ring rounded-md border hover:ring-1"
              {...fieldProps}
            />
          </FormControl>
        ) : type !== "password" ? (
          <FormControl>
            <Input
              className="border-primary/40 hover:ring-ring border hover:ring-1"
              type={type}
              {...fieldPropsWithoutShowLabel}
            />
          </FormControl>
        ) : (
          <FormControlPassword
            fieldPropsWithoutShowLabel={fieldPropsWithoutShowLabel}
          />
        )}
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
});

AutoFormInput.displayName = "AutoFormInput";

export default AutoFormInput;
