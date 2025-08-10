"use client";

import * as React from "react";
import { usePathname } from "@/src/i18n/navigation";
import type { Column, ColumnMeta, Table } from "@tanstack/react-table";
import { DownloadIcon, RefreshCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableDateFilter } from "@/components/advanced-tables/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/advanced-tables/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/components/advanced-tables/data-table-slider-filter";
import { DataTableViewOptions } from "@/components/advanced-tables/data-table-view-options";

import { exportTableToCSV } from "../ui/tools/export";
import { DataTableActionFlag } from "./data-table-action-flag";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  hideExport?: boolean;
  refreshButton?: boolean;
  importCsvComponent?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  hideExport = true,
  refreshButton,
  importCsvComponent,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const tTable = useTranslations("Tables");
  const getAllColumns = table.getAllColumns();
  const columns = React.useMemo(
    () => getAllColumns.filter((column) => column.getCanFilter()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAllColumns]
  );

  const pathname = usePathname();
  const time = new Date().getTime();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [revalidate, setRevalidate] = useQueryState(
    "revalidate",
    parseAsString.withDefault("0").withOptions({
      clearOnDefault: true,
      shallow: false,
      throttleMs: 50,
    })
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  const handleRefresh = async () => {
    if (refreshButton) {
      setIsRefreshing(true);
      try {
        await setRevalidate(new Date().getTime().toString());
        await setRevalidate("0");
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }
    }
  };

  const columnsOrdered = columns.sort((a, b) => {
    const aMeta = a.columnDef.meta as ColumnMeta<TData, unknown> & {
      order?: number;
    };
    const bMeta = b.columnDef.meta as ColumnMeta<TData, unknown> & {
      order?: number;
    };
    return (
      (aMeta?.order ?? columns?.length) - (bMeta?.order ?? columns?.length)
    );
  });

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 px-1 pt-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columnsOrdered.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onReset}
          >
            <X size={16} />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {refreshButton && (
          <Button
            variant="primary"
            size="sm"
            className="h-8"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`size-4 ${isRefreshing ? "animate-spin duration-500" : ""}`}
              aria-hidden="true"
            />
          </Button>
        )}
        {importCsvComponent && importCsvComponent}
        {children}

        {!hideExport && (
          <Button
            variant="primary"
            size="sm"
            className="h-8"
            onClick={() =>
              exportTableToCSV(table, {
                filename: `limited_hub${pathname}-${time}`,
                excludeColumns: ["select", "actions"],
              })
            }
          >
            <DownloadIcon className="size-4 xl:mr-2" aria-hidden="true" />
            <span className="hidden xl:block">{tTable("export")}</span>
          </Button>
        )}
        <DataTableActionFlag />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta as ColumnMeta<TData, unknown> & {
      onlyAdvancedFilter?: boolean;
    };

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;
      if (columnMeta.onlyAdvancedFilter) return null;

      switch (columnMeta.variant) {
        case "text":
        case "uuid":
          return (
            <Input
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="hover:border-primary focus:hover:border-input h-8 w-40 lg:w-56"
            />
          );

        case "number":
          return (
            <div className="relative">
              <Input
                type="number"
                inputMode="numeric"
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
              />
              {columnMeta.unit && (
                <span className="bg-accent text-muted-foreground absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );

        case "range":
          return (
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

        case "date":
        case "dateRange":
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === "dateRange"}
            />
          );

        case "select":
        case "multiSelect":
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === "multiSelect"}
              icon={columnMeta.icon as React.ReactNode}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
