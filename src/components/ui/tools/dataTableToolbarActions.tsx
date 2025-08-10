"use client";

import { useState } from "react";
import { exportTableToCSV } from "@/src/components/ui/tools/export";
import { useDeleteModal } from "@/src/context/deleteModalProvider";
import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";
import { DownloadIcon } from "@radix-ui/react-icons";
import { RefreshCw, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DataTableToolbarActionsProps,
  SelectFunction,
} from "@/types/datasTable";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";

export function DataTableToolbarActions({
  table,
  onDeleteMultipleFunction,
  multipleSelectFunctions = [], // default empty array
  hideExport = false,
  refreshFunction,
  importCsvComponent,
}: DataTableToolbarActionsProps) {
  const { openModal } = useDeleteModal();
  const tTable = useTranslations("Tables");
  const pathname = usePathname();
  const time = new Date().getTime();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDeleteMultiple = async (selectedRows: any[]) => {
    const idsToDelete = selectedRows.map((row) => row.original.id);
    if (onDeleteMultipleFunction) {
      openModal(
        idsToDelete as string[] | number[],
        onDeleteMultipleFunction,
        table
      );
    }
  };

  const handleTriggerAction = async (
    action: SelectFunction,
    selectedRows: any[]
  ) => {
    try {
      // Await result in case it's a promise
      const result = await action.onTrigger(selectedRows);

      if (result === true) {
        // Toggle selection for all selected rows
        table.toggleAllPageRowsSelected(false);
      }
    } catch (error) {
      console.error("Error while triggering action: ", error);
    }
  };

  const handleRefresh = async () => {
    if (refreshFunction) {
      setIsRefreshing(true);
      try {
        await refreshFunction();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  return (
    <div className="flex items-center gap-2">
      {refreshFunction && (
        <Button
          variant="primary"
          size="sm"
          onClick={handleRefresh}
          aria-label={tTable("ariaRefreshButton")}
          title={tTable("ariaRefreshButton")}
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin duration-500" : ""}`}
            aria-hidden="true"
          />
        </Button>
      )}
      {selectedRows.length > 0 &&
        multipleSelectFunctions
          .filter((action) =>
            action.condition ? action.condition(selectedRows) : true
          ) // Only show buttons that meet the condition
          .map((action, index) => (
            <Button
              key={index}
              variant={action.variant ? action.variant : "primary"}
              size="sm"
              onClick={() => handleTriggerAction(action, selectedRows)}
              className={cn("gap-1 xl:gap-0", action.className ?? "")}
              disabled={action.isPending}
              aria-label={action.ariaLabel || action.text}
              title={action.ariaLabel || action.text}
            >
              {action.isPending ? (
                <LoadIcon size={24} />
              ) : (
                <>
                  {action.icon}
                  {action.showText !== false && (
                    <span className="hidden xl:mr-1 xl:block">
                      {action.text}
                    </span>
                  )}
                  ({selectedRows.length})
                </>
              )}
            </Button>
          ))}
      {selectedRows.length > 0 && onDeleteMultipleFunction && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            handleDeleteMultiple(table.getFilteredSelectedRowModel().rows)
          }
          className="gap-1 xl:gap-0"
          aria-label={tTable("ariaDeleteElements")}
          title={tTable("ariaDeleteElements")}
        >
          <TrashIcon className="size-4 xl:mr-2" aria-hidden="true" />
          <span className="hidden lg:block xl:mr-1">{tTable("delete")}</span> (
          {table.getFilteredSelectedRowModel().rows.length})
        </Button>
      )}
      {importCsvComponent && importCsvComponent}
      {!hideExport && (
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            exportTableToCSV(table, {
              filename: `limited_hub${pathname}-${time}`,
              excludeColumns: ["select", "actions"],
            })
          }
          aria-label={tTable("ariaExportButton")}
          title={tTable("ariaExportButton")}
        >
          <DownloadIcon className="size-4 xl:mr-2" aria-hidden="true" />
          <span className="hidden xl:block">{tTable("export")}</span>
        </Button>
      )}
    </div>
  );
}
