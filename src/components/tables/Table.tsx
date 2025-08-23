"use client";

import { DataTableProps } from "@/types/datasTable";

import { DataTable } from "./DataTable";

const Table = <TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  onDeleteMultipleFunction,
  showColumns,
  multipleSelectFunctions,
  hideExport,
  devEditAllRowsFunction,
  devEditOneRowFunction,
  CardComponent,
  viewMode,
  setViewMode,
  refreshFunction,
  synchronizeUrl,
  importCsvComponent,
  cellPadding,
  stripedRows = false,
  parentClassName,
}: DataTableProps<TData, TValue>) => {
  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        filterTextOptions={filterTextOptions}
        columnConfigs={columnConfigs}
        rowLink={rowLink}
        onDeleteMultipleFunction={onDeleteMultipleFunction}
        showColumns={showColumns}
        multipleSelectFunctions={multipleSelectFunctions}
        hideExport={hideExport}
        devEditAllRowsFunction={devEditAllRowsFunction}
        devEditOneRowFunction={devEditOneRowFunction}
        CardComponent={CardComponent}
        viewMode={viewMode}
        setViewMode={setViewMode}
        refreshFunction={refreshFunction}
        synchronizeUrl={synchronizeUrl}
        importCsvComponent={importCsvComponent}
        parentClassName={parentClassName}
        cellPadding={cellPadding}
        stripedRows={stripedRows}
      />
    </>
  );
};

export default Table;
