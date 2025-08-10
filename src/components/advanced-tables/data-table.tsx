import type * as React from "react";
import { usePathname } from "@/src/i18n/navigation";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/advanced-tables/data-table-pagination";

import { RowLink } from "./DataAdvancedTable";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  rowLink?: string | RowLink | ((row: any) => any) | undefined;
  isFetching?: boolean;
  rowsSkeleton?: React.ReactNode;
  rowCount: number;
  cellPadding?: string;
  importCsvComponent?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  rowLink,
  isFetching,
  rowsSkeleton,
  rowCount,
  cellPadding = "py-2",
  importCsvComponent,
  ...props
}: DataTableProps<TData>) {
  const pathname = usePathname();

  const handleRowClick = (
    cell: any,
    row: any,
    rowLink: string | RowLink | ((row: any) => any) | undefined
  ) => {
    if (
      cell.column.id !== "actions" &&
      cell.column.id !== "image" &&
      !rowLink
    ) {
      row.toggleSelected(!row.getIsSelected());
    } else {
      if (
        rowLink &&
        cell.column.id !== "actions" &&
        cell.column.id !== "select" &&
        cell.column.id !== "product_id" &&
        cell.column.id !== "image"
      ) {
        const datas: any = row.original;

        if (typeof rowLink === "function") {
          rowLink(row);
        } else if (typeof rowLink === "object") {
          const url = `${window.location.origin}${rowLink.customPath}/${datas[rowLink.key]}`;
          window.open(url, "_blank");
        } else {
          const url = `${window.location.origin}${pathname}/${datas[rowLink]}`;
          window.open(url, "_blank");
        }
      }
    }
  };

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching && rowsSkeleton ? (
              rowsSkeleton
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("", rowLink && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => handleRowClick(cell, row, rowLink)}
                      className={cellPadding}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} rowCount={rowCount} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
