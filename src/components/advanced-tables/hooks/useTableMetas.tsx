"use client";

import { useMemo } from "react";
import { AdvancedFilterOptionType } from "@/types";
import { ColumnMeta } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { TableMetasWithIcons } from "@/components/advanced-tables/types/advancedDatatableType";

export const useTableMetas = <T extends TableMetasWithIcons>({
  baseMetas,
  options,
}: {
  baseMetas: T;
  options: Record<string, AdvancedFilterOptionType[]>;
}) => {
  const tTable = useTranslations("Tables");

  return useMemo(() => {
    return Object.entries(baseMetas).reduce(
      (acc, [key, meta]) => {
        acc[key] = {
          ...meta,
          icon: meta.icon as any,
          placeholder: meta.placeholder
            ? tTable(meta.placeholder as keyof MessagesIntl) + "..."
            : undefined,
          label: meta.label ? tTable(meta.label as keyof MessagesIntl) : "",
          options: options[key] || undefined,
        };
        return acc;
      },
      {} as { [key: string]: ColumnMeta<any, any> }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);
};
