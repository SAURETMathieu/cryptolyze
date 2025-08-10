import { memo, useCallback, useRef } from "react";
import { RowLink } from "@/types";
import { Row } from "@tanstack/react-table";

import { TableCellComponent } from "./MemoizedTableCell";

export const MemoizedTableCell = memo(
  ({
    cell,
    row,
    rowLink,
    onDeleteMultipleFunction,
    multipleSelectFunctions,
    isSelected,
    cellPadding,
  }: {
    cell: any;
    row: Row<any>;
    rowLink: string | RowLink | ((row: any) => any) | undefined;
    onDeleteMultipleFunction?:
      | ((ids: string[] | number[]) => Promise<boolean>)
      | undefined;
    multipleSelectFunctions?: any;
    isSelected: boolean;
    cellPadding?: string;
  }) => {
    const cellRef = useRef(cell);
    const rowRef = useRef(row);
    const rowLinkRef = useRef(rowLink);

    const handleRowClick = useCallback(() => {
      const currentCell = cellRef.current;
      const currentRow = rowRef.current;
      const currentRowLink = rowLinkRef.current;

      if (
        currentCell.column.id !== "actions" &&
        currentCell.column.id !== "image" &&
        !currentRowLink
      ) {
        if (onDeleteMultipleFunction || multipleSelectFunctions) {
          currentRow.toggleSelected(!currentRow.getIsSelected());
        }
      } else {
        if (
          currentRowLink &&
          currentCell.column.id !== "actions" &&
          currentCell.column.id !== "select" &&
          currentCell.column.id !== "image" &&
          currentCell.column.id !== "product_id"
        ) {
          const datas: any = currentRow.original;
          const pathname = window.location.pathname;

          if (typeof currentRowLink === "function") {
            currentRowLink(currentRow);
          } else if (typeof currentRowLink === "object") {
            const url = `${window.location.origin}${currentRowLink.customPath}/${datas[currentRowLink.rowLink]}`;
            window.open(url, "_blank");
          } else {
            const url = `${window.location.origin}${pathname}/${datas[currentRowLink]}`;
            window.open(url, "_blank");
          }
        }
      }
    }, [onDeleteMultipleFunction, multipleSelectFunctions]);

    cellRef.current = cell;
    rowRef.current = row;
    rowLinkRef.current = rowLink;

    return (
      <TableCellComponent
        cell={cell}
        handleRowClick={handleRowClick}
        isSelected={isSelected}
        cellPadding={cellPadding}
      />
    );
  }
);

MemoizedTableCell.displayName = "MemoizedTableCell";
