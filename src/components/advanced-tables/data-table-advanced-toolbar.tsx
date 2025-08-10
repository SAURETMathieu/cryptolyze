"use client";

import * as React from "react";
import { usePathname } from "@/src/i18n/navigation";
import type { Table } from "@tanstack/react-table";
import { DownloadIcon, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import { cn } from "@/lib/utils";
import { DataTableViewOptions } from "@/components/advanced-tables/data-table-view-options";

import { Button } from "../ui/button";
import { exportTableToCSV } from "../ui/tools/export";
import { DataTableActionFlag } from "./data-table-action-flag";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
  hideExport?: boolean;
  refreshButton?: boolean;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  hideExport = true,
  refreshButton = false,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const pathname = usePathname();
  const time = new Date().getTime();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const tTable = useTranslations("Tables");
  const [revalidate, setRevalidate] = useQueryState(
    "revalidate",
    parseAsString.withDefault("0").withOptions({
      clearOnDefault: true,
      shallow: false,
      throttleMs: 50,
    })
  );

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
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
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
              className={cn(
                "size-4",
                isRefreshing ? "animate-spin duration-500" : ""
              )}
              aria-hidden="true"
            />
          </Button>
        )}
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
