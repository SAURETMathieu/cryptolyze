"use client";

import * as React from "react";
import { columnBreakpoints } from "@/src/components/tables/columns/utils/columnBreakpoints";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { DataTablePagination } from "@/src/components/ui/tools/dataTablePagination";
import { DataTableToolbar } from "@/src/components/ui/tools/dataTableToolbar";
import DevModal from "@/src/dev/DevModal";
import { useTableUrlSync } from "@/src/hooks";
import useBreakpoints from "@/src/hooks/useBreakpoint";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Meh } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableProps } from "@/types/datasTable";

import { MemoizedTableRow } from "./MemoizedRow";

export function DataTable<TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  onDeleteMultipleFunction,
  multipleSelectFunctions,
  showColumns,
  hideExport,
  devEditAllRowsFunction,
  devEditOneRowFunction,
  CardComponent,
  viewMode,
  setViewMode,
  refreshFunction,
  importCsvComponent,
  synchronizeUrl = false,
  cellPadding,
  stripedRows = false,
  parentClassName,
  initialSelectedRowIndexes,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string | number, boolean>
  >(initialSelectedRowIndexes || {});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      sku: false,
      brand: false,
      ...showColumns,
    });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { sm, md, lg, xl, xxl } = useBreakpoints();

  const isDevMode = process.env.NODE_ENV === "development";

  const t = useTranslations("Tables");

  const endpoints = React.useMemo(
    () => ({ sm, md, lg, xl, xxl }),
    [sm, md, lg, xl, xxl]
  );

  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const memoizedData = React.useMemo(() => {
    return data;
  }, [data]);

  const rowProps = React.useMemo(
    () => ({
      rowLink,
      onDeleteMultipleFunction,
      multipleSelectFunctions,
      isDevMode,
      devEditOneRowFunction,
      cellPadding,
      columnVisibility,
      stripedRows,
    }),
    [
      rowLink,
      onDeleteMultipleFunction,
      multipleSelectFunctions,
      isDevMode,
      devEditOneRowFunction,
      cellPadding,
      columnVisibility,
      stripedRows,
    ]
  );

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
  });

  useTableUrlSync(
    table,
    synchronizeUrl,
    filterTextOptions?.id,
    refreshFunction
  );

  React.useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(columnBreakpoints, column.id)) {
        const columnEndpoint = columnBreakpoints[column.id];
        column.toggleVisibility(
          endpoints[columnEndpoint as keyof typeof endpoints]
        );
      }
    });
  }, [endpoints, table]);

  return (
    <div className="space-y-3">
      <DataTableToolbar
        table={table}
        filterTextOptions={filterTextOptions}
        columnConfigs={columnConfigs}
        onDeleteMultipleFunction={onDeleteMultipleFunction}
        multipleSelectFunctions={multipleSelectFunctions}
        hideExport={hideExport}
        showViewMode={!!CardComponent}
        viewMode={viewMode}
        setViewMode={setViewMode}
        refreshFunction={refreshFunction}
        importCsvComponent={importCsvComponent}
      />
      {viewMode === "card" &&
        (() => {
          const selectHeader = table
            .getHeaderGroups()
            .map((headerGroup) =>
              headerGroup.headers.find((header) => header.id === "select")
            )
            .find((header) => header !== undefined);

          const selectAllElement = selectHeader
            ? flexRender(
                selectHeader.column.columnDef.header,
                selectHeader.getContext()
              )
            : null;

          return (
            <div className="flex w-full items-center gap-2">
              {selectAllElement && <div className="">{selectAllElement}</div>}
              <div className="flex-1">
                <DataTablePagination
                  table={table}
                  key={`top-${table.getState().pagination.pageIndex}-${table.getState().pagination.pageSize}`}
                  viewMode={viewMode}
                />
              </div>
            </div>
          );
        })()}

      {viewMode !== "card" ? (
        <div className="overflow-hidden rounded-lg border">
          <Table className="" parentClassName={parentClassName}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                  {isDevMode && (
                    <DevModal
                      datas={table
                        .getCoreRowModel()
                        .rows.map((row) => row.original)}
                      title="Détail de la table"
                      collapseDepth={1}
                      onSave={devEditAllRowsFunction}
                    />
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <MemoizedTableRow
                      key={row.id}
                      row={row}
                      isSelected={row.getIsSelected()}
                      {...rowProps}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("no-results")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const selectCell = row
                .getVisibleCells()
                .find((cell) => cell.column.id === "select");

              const selectElement = selectCell
                ? flexRender(
                    selectCell.column.columnDef.cell,
                    selectCell.getContext()
                  )
                : null;

              return CardComponent ? (
                <CardComponent
                  key={row.id}
                  row={row}
                  selectElement={selectElement}
                />
              ) : null;
            })
          ) : (
            <div className="col-span-full my-24 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
              <Meh size={48} />
              <span className="font-medium">{t("no-results")}</span>
            </div>
          )}
        </div>
      )}
      <DataTablePagination
        table={table}
        key={`bottom-${table.getState().pagination.pageIndex}-${table.getState().pagination.pageSize}`}
        viewMode={viewMode}
      />
    </div>
  );
}
