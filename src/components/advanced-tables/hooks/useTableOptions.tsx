// hooks/useTableOptions.ts
import { useMemo } from "react";
import { BadgeVariantType } from "@/src/components/ui/badge";
import {
  capitalize,
  createBrandOptions,
  createCountryOptions,
  createUniqueOptions,
} from "@/src/utils";
import { createBadgeOptions } from "@/utils/getFilterOptions/createBadgeOptions";
import { useTranslations } from "next-intl";

type Distinct = { value: string; count?: number };

interface OptionConfig<T = Distinct> {
  type: "country" | "unique" | "badge" | "language" | "brand";
  data: T[];
  labelFormatter?: (
    value: string | null | undefined
  ) => string | React.ReactElement;
  colorFunction?: (value: string) => BadgeVariantType;
}

type OptionConfigMap = Record<string, OptionConfig>;

export function useTableOptions(configs: OptionConfigMap) {
  const t = useTranslations("Tables");

  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(configs).map(([key, config]) => {
        let options: any[] = [];

        switch (config.type) {
          case "country":
            options = createCountryOptions(
              config.data,
              (item) => item.value,
              false,
              (item) => item.count || 0
            );
            break;

          case "language":
            options = createCountryOptions(
              config.data,
              (item) => item.value,
              true,
              (item) => item.count || 0
            );
            break;

          case "unique":
            options = createUniqueOptions(
              config.data,
              (item) => item.value,
              config.labelFormatter ??
                ((value) => (value ? capitalize(value) : "")),
              undefined,
              "asc",
              (item) => item.count || 0
            );
            break;

          case "badge":
            options = createBadgeOptions(
              config.data,
              (item) => item.value,
              t,
              config.colorFunction ?? (() => "black" as BadgeVariantType),
              undefined,
              (item) => item.count || 0
            );
            break;

          case "brand":
            options = createBrandOptions(
              config.data,
              (item) => item.value,
              (item) => item.count || 0
            );
            break;
        }

        return [key, options] as const;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs]);
}
