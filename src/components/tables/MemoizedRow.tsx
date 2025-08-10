import { memo } from "react";
import { TableRow } from "@/src/components/ui/table";
import DevModal from "@/src/dev/DevModal";
import { cn } from "@/src/lib/utils";
import { RowLink } from "@/types";
import { Row, VisibilityState } from "@tanstack/react-table";

import { MemoizedTableCell } from "./MemoizedCell";

interface MemoizedTableRowProps {
  row: Row<any>;
  rowLink: string | RowLink | ((row: any) => any) | undefined;
  onDeleteMultipleFunction?:
    | ((ids: string[] | number[]) => Promise<boolean>)
    | undefined;
  multipleSelectFunctions?: any;
  isDevMode: boolean;
  devEditOneRowFunction?: (row: any) => void;
  isSelected: boolean;
  cellPadding?: string;
  columnVisibility: VisibilityState;
  stripedRows?: boolean;
}

export const MemoizedTableRow = memo(
  function RowContent({
    row,
    rowLink,
    onDeleteMultipleFunction,
    multipleSelectFunctions,
    isDevMode,
    devEditOneRowFunction,
    isSelected,
    cellPadding,
    columnVisibility,
    stripedRows,
  }: MemoizedTableRowProps) {
    return (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() ? "selected" : undefined}
        className={cn(
          "cursor-pointer",
          row.getIsSelected() && "bg-muted",
          isDevMode && "relative",
          stripedRows && row.index % 2 === 1 && "bg-input/70 dark:bg-input/30",
          stripedRows && "hover:bg-input hover:dark:bg-input/90"
        )}
      >
        {row.getVisibleCells().map((cell, index) => (
          <MemoizedTableCell
            key={index}
            cell={cell}
            row={row}
            rowLink={rowLink}
            onDeleteMultipleFunction={onDeleteMultipleFunction}
            multipleSelectFunctions={multipleSelectFunctions}
            isSelected={isSelected}
            cellPadding={cellPadding}
          />
        ))}
        {isDevMode && (
          <DevModal datas={row.original} onSave={devEditOneRowFunction} />
        )}
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    const prevRowData = prevProps.row.original;
    const nextRowData = nextProps.row.original;
    const prevIsSelected = prevProps.isSelected;
    const nextIsSelected = nextProps.isSelected;
    const prevColumnVisibility = prevProps.columnVisibility;
    const nextColumnVisibility = nextProps.columnVisibility;
    return (
      JSON.stringify(prevRowData) === JSON.stringify(nextRowData) &&
      prevIsSelected === nextIsSelected &&
      prevProps.row.id === nextProps.row.id &&
      JSON.stringify(prevColumnVisibility) ===
        JSON.stringify(nextColumnVisibility)
    );
  }
);

MemoizedTableRow.displayName = "MemoizedTableRow";
