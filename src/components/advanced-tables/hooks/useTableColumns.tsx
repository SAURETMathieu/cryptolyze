"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { TableMetasWithIcons } from "../types/advancedDatatableType";
import { useTableMetas } from "./useTableMetas";
import { useTableOptions } from "./useTableOptions";

interface UseTableColumnsProps {
  baseMetas: TableMetasWithIcons;
  optionsConfig: Parameters<typeof useTableOptions>[0];
  createColumns: (tTable: any, metas: any) => any[];
}

export function useTableColumns({
  baseMetas,
  optionsConfig,
  createColumns,
}: UseTableColumnsProps): ColumnDef<any, any>[] {
  const tTable = useTranslations("Tables");

  const options = useTableOptions(optionsConfig);

  const metas = useTableMetas({
    baseMetas,
    options,
  });

  const columns = useMemo(
    () => createColumns(tTable, metas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metas]
  );

  return columns;
}
