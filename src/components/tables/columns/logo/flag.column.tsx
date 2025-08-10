import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/src/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { CountryCode } from "libphonenumber-js";
import flags from "react-phone-number-input/flags";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface CustomColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  renderCell?: (data: any) => React.ReactNode;
  filterFn?: FilterFn<any>;
  headerClassName?: string;
  cellClassName?: string;
  isLanguage?: boolean;
}

/**
 * Creates a column to display country flags based on the country code.
 *
 * @param {Object} params - The parameters to configure the flag column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the country code.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {function} [params.renderCell] - Custom render function for the cell. If not provided, the flag image will be displayed.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.cellClassName] - Additional CSS classes for the cell.
 * @param {boolean} [params.isLanguage=false] - Indicates if the column is a language column.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const flagColumn = createFlagColumn({
 *   id: "country",
 *   title: "Country",
 *   accessorKey: "address.countryCode",
 *   enableSorting: true,
 *   enableHiding: true,
 *   filterFn: (row, id, value) => value.includes(row.getValue(id))
 * });
 */
export function createFlagColumn({
  id,
  title,
  accessorKey,
  enableSorting = false,
  enableHiding = false,
  renderCell,
  filterFn,
  headerClassName,
  cellClassName,
  isLanguage = false,
}: CustomColumnProps): ColumnDef<any> {
  const languageMap = {
    EN: "GB",
    CS: "CZ",
    SV: "SE",
  } as const;
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("max-w-[75px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;

      const countryCode = getNestedValueFunction(datas, accessorKey);
      const Flag =
        flags[
          isLanguage
            ? languageMap[countryCode as keyof typeof languageMap] ||
              countryCode
            : (countryCode as CountryCode)
        ];

      return renderCell ? (
        renderCell(datas)
      ) : (
        <div
          className={cn(
            "mx-auto flex h-full w-10 items-center justify-center",
            cellClassName
          )}
        >
          {Flag && <Flag title={countryCode} />}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
