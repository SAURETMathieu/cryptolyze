import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  rowCount: number;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [25, 50, 100, 200, 300],
  className,
  rowCount,
  ...props
}: DataTablePaginationProps<TData>) {
  const tTable = useTranslations("Tables");

  const totalPages = Math.ceil(rowCount / table.getState().pagination.pageSize);
  const currentPage = table.getState().pagination.pageIndex;

  const hasNoData = rowCount === 0;
  const canGoPrevious = !hasNoData && currentPage > 0;
  const canGoNext = !hasNoData && currentPage < totalPages - 1;

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className
      )}
      {...props}
    >
      <div className="text-muted-foreground flex-1 whitespace-nowrap text-sm">
        {table.getFilteredRowModel().rows.length} {tTable("of")} {rowCount}{" "}
        {tTable("row")}(s).
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            {tTable("rowPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {tTable("page")} {currentPage + 1} {tTable("of")}{" "}
          {Math.max(1, totalPages)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label={tTable("firstPage")}
            variant="outline"
            size="icon"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!canGoPrevious}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            aria-label={tTable("previousPage")}
            variant="outline"
            size="icon"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label={tTable("nextPage")}
            variant="outline"
            size="icon"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!canGoNext}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            aria-label={tTable("lastPage")}
            variant="outline"
            size="icon"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!canGoNext}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
