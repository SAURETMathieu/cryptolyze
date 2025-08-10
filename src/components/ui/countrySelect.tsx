import { filterCountries } from "@/src/lib/helpers/filterCountries";
import { fetchCountries } from "@/src/store/global.store";
import { useEffect, useMemo } from "react";
//@ts-ignore
import countryRegionData from "country-region-data/dist/data-umd";
import { CountryCode } from "libphonenumber-js/core";
import { useLocale } from "next-intl";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { FieldConfigItem } from "@/components/auto-form/types";
import FlagComponent from "@/components/ui/flagComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useFormField } from "./form";

export interface Region {
  name: string;
  shortCode: string;
}

export interface CountryRegion {
  countryName: string;
  countryShortCode: string | CountryCode;
  regions: Region[];
}

interface CountrySelectProps {
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
  field: ControllerRenderProps<FieldValues, any>;
  fieldProps: any;
  fieldConfigItem: FieldConfigItem;
}

function CountrySelect({
  priorityOptions = [],
  whitelist = [],
  blacklist = [],
  field,
  fieldProps,
  fieldConfigItem,
}: CountrySelectProps) {
  const locale = useLocale();

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    const countryRegionDataTranslated = countryRegionData.map(
      (country: CountryRegion) => {
        return {
          ...country,
          countryName:
            locale === "fr"
              ? country.countryShortCode || country.countryName
              : country.countryName,
        };
      },
    );
    return filterCountries(
      countryRegionDataTranslated,
      priorityOptions,
      whitelist,
      blacklist,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, whitelist]);

  const memoizedSelectItems = useMemo(() => {
    return filteredCountries.map(({ countryName, countryShortCode }) => (
      <SelectItem key={countryShortCode} value={countryShortCode}>
        <div className="border-primary/40 flex items-center gap-2 rounded-md">
          <FlagComponent
            country={countryShortCode as CountryCode}
            countryName={countryName}
            key={countryShortCode}
          />
          {countryName}
        </div>
      </SelectItem>
    ));
  }, [filteredCountries]);

  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
      {...fieldProps}
    >
      <SelectTrigger
        className={cn(
          "border-primary/40 hover:ring-ring border hover:ring-1",
          fieldProps.className,
        )}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
      >
        <SelectValue
          placeholder={fieldConfigItem.inputProps?.placeholder}
        ></SelectValue>
      </SelectTrigger>
      <SelectContent>{memoizedSelectItems}</SelectContent>
    </Select>
  );
}

export default CountrySelect;
