"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface DataRowsSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Columns in the table.
   * @type ColumnDef<any>[]
   */
  columns: ColumnDef<any>[];

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[];

  /**
   * The height of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS height value is accepted.
   * @default 40
   * @type string | undefined
   */
  cellHeights?: number;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean;

  /**
   * The columns to show in the table.
   * @type {Record<string, boolean>}
   */
  showColumns?: Record<string, boolean>;
}

export function DataRowsSkeleton(props: DataRowsSkeletonProps) {
  const {
    columns,
    rowCount = 10,
    cellWidths = ["auto"],
    cellHeights = 40,
    shrinkZero = false,
    showColumns,
  } = props;

  const nbShowColumns = showColumns
    ? columns.filter((column) => showColumns[column.id as string] !== false)
        .length
    : columns.length;

  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i} className="w-full hover:bg-transparent">
          {Array.from({ length: Math.min(nbShowColumns) }).map((_, j) => (
            <TableCell
              key={j}
              style={{
                width: cellWidths[j],
                minWidth: shrinkZero ? cellWidths[j] : "auto",
                height: cellHeights + "px",
              }}
            >
              <Skeleton className="size-full min-h-8" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
