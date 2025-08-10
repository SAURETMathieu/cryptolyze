"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";

import { CellContent } from "./CellContent";
import { CsvImporterPropsType } from "./csv-importer";

interface RowContentProps<T> {
  row: Record<string, unknown>;
  index: number;
  fields: CsvImporterPropsType<T>["fields"];
  isRowValid: (index: number) => boolean;
  getCellError: (rowIndex: number, fieldValue: string) => string | undefined;
  onCellEdit: (rowIndex: number, fieldValue: string, value: string) => void;
  setCurrentErrorIndex: (index: number) => void;
  errorRows: number[];
}

export const RowContent = memo(function RowContent<T>({
  row,
  index,
  fields,
  isRowValid,
  getCellError,
  onCellEdit,
  setCurrentErrorIndex,
  errorRows,
}: RowContentProps<T>) {
  return (
    <TableRow
      key={index}
      id={`csv-import-table-row-${index}`}
      className={cn(
        "h-10",
        index % 2 === 1 && "bg-primary/5",
        !isRowValid(index) &&
          "bg-red-300 hover:bg-red-300 dark:bg-red-400 dark:hover:bg-red-400"
      )}
    >
      <TableCell className="border-r text-center font-medium">
        {index + 1}
      </TableCell>
      {fields.map((field) => (
        <TableCell
          key={field.value}
          className={cn(
            "max-w-48 border-r last:border-r-0",
            getCellError(index, field.value) && "bg-red-400 dark:bg-red-500"
          )}
          title={String(row[field.value] ?? "")}
        >
          <CellContent
            row={row}
            field={field}
            rowIndex={index}
            onCellEdit={onCellEdit}
            getCellError={getCellError}
            setCurrentErrorIndex={setCurrentErrorIndex}
            errorRows={errorRows}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});
