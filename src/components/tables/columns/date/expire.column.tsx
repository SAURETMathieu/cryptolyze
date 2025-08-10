import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/src/lib/utils";
import { timeRemainingOrExpired } from "@/src/utils/dates/timeRemainingOrExpired";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface ExpirationColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
}

/**
 * Creates an expiration column for a table.
 *
 * @param {Object} params - The parameters to configure the expiration column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the expiration date.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const expirationColumn = createExpirationColumn({
 *   id: "expiresIn",
 *   title: "Expires in",
 *   accessorKey: "expires_at",
 *   className: "text-md",
 *   headerClassName: "max-w-[60px]",
 * });
 */
export function createExpirationColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
}: ExpirationColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[60px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      const date = getNestedValueFunction(datas, accessorKey);
      const dateFormatted = timeRemainingOrExpired(date);

      return (
        <span
          className={cn(
            "max-w-[60px]",
            dateFormatted === "Expired"
              ? "font-bold text-red-700"
              : "font-medium",
            className
          )}
        >
          {dateFormatted}
        </span>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
