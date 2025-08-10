"use client";

import * as React from "react";
import {
  ColumnDef,
  type TableState,
  type VisibilityState,
} from "@tanstack/react-table";

import { DataTable } from "@/components/advanced-tables/data-table";
import { DataTableAdvancedToolbar } from "@/components/advanced-tables/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/advanced-tables/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/advanced-tables/data-table-filter-menu";
import { DataTableSortList } from "@/components/advanced-tables/data-table-sort-list";

import { DataTableToolbar } from "./data-table-toolbar";
import { ExtendedColumnSort } from "./types/advancedDatatableType";
import { useFeatureFlags } from "./utils/feature-flags-provider";
import { useDataTable } from "./utils/useDataTable";

export type RowLink = {
  params: string;
  customPath: string;
  key: string;
};

const defaultInitialState: Omit<Partial<TableState>, "sorting"> & {
  sorting?: ExtendedColumnSort<any>[];
} = {
  sorting: [{ id: "createdAt", desc: true }],
  columnPinning: { right: ["actions"] },
};

interface DataAdvancedTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowLink?: string | RowLink | ((row: any) => any) | undefined;
  actionBar?: React.ReactNode;
  showColumns?: VisibilityState;
  rowCount: number;
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  hideExport?: boolean;
  devEditOneRowFunction?: (row: any) => void;
  devEditAllRowsFunction?: (rows: any[]) => void;
  rowId?: string;
  isFetching?: boolean;
  rowsSkeleton?: React.ReactNode;
  refreshButton?: boolean;
  cellPadding?: string;
  importCsvComponent?: React.ReactNode;
}

export function DataAdvancedTable<TData, TValue>({
  columns,
  data,
  rowCount,
  rowLink,
  showColumns,
  hideExport = true,
  devEditAllRowsFunction,
  devEditOneRowFunction,
  refreshButton,
  actionBar,
  initialState = defaultInitialState,
  rowId = "id",
  isFetching = true,
  rowsSkeleton,
  cellPadding = "py-2",
  importCsvComponent,
}: DataAdvancedTableProps<TData, TValue>) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    rowCount,
    enableAdvancedFilter,
    initialState,
    showColumns,
    getRowId: (originalRow) => (originalRow as Record<string, any>)[rowId],
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable
      table={table}
      rowLink={rowLink}
      actionBar={actionBar}
      isFetching={isFetching}
      rowsSkeleton={rowsSkeleton}
      rowCount={rowCount}
      cellPadding={cellPadding}
    >
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar
          table={table}
          refreshButton={refreshButton}
          hideExport={hideExport}
        >
          <DataTableSortList table={table} align="start" />
          {filterFlag === "advancedFilters" ? (
            <DataTableFilterList
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
              align="start"
            />
          ) : (
            <DataTableFilterMenu
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
          )}
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar
          table={table}
          hideExport={hideExport}
          refreshButton={refreshButton}
          importCsvComponent={importCsvComponent}
        >
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}
