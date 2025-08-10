import { memo } from "react";
import { TableCell } from "@/src/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export const TableCellComponent = memo(
  ({
    cell,
    handleRowClick,
    isSelected,
    cellPadding,
  }: {
    cell: any;
    handleRowClick: () => void;
    isSelected: boolean;
    cellPadding?: string;
  }) => {
    return (
      <TableCell key={cell.id} onClick={handleRowClick} className={cellPadding}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  }
);

TableCellComponent.displayName = "TableCellComponent";
