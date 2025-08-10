import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/src/lib/utils";
import { getOptionsIconAndStyle } from "@/src/utils/getFilterOptions/getOptionsIconAndStyle";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface OptionsColumnProps {
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
 * Creates a string column for a table.
 *
 * @param {Object} params - The parameters to configure the string column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the string value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const nameColumn = createStringColumn({
 *   id: "name",
 *   title: "Name",
 *   accessorKey: "name",
 *   className: "text-md font-medium",
 *   headerClassName: "text-center",
 *   enableSorting: true,
 * });
 */
export function createOptionsColumn({
  id,
  title = "Options",
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
}: OptionsColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto min-w-[150px] max-w-[150px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const options = getNestedValueFunction(datas, accessorKey);
      return (
        <div className={cn("flex flex-wrap justify-center gap-1", className)}>
          {options && options.length > 0
            ? options.map((option: any) => {
                const { icon, style } = getOptionsIconAndStyle(option.type);
                return (
                  <TooltipProvider key={option.type}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="primary"
                          size="icon"
                          className={cn(
                            "text-md rounded-lg px-1 capitalize",
                            style
                          )}
                        >
                          {icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-primary/70 bg-muted rounded-lg border p-3 shadow-md">
                        <div className="flex w-full flex-col items-center justify-between gap-1">
                          <Button
                            variant="primary"
                            size="icon"
                            className={cn(
                              "text-md rounded-lg px-1 capitalize",
                              style
                            )}
                          >
                            {icon}
                          </Button>
                          <h4 className="text-md font-bold capitalize">
                            {option.type}
                          </h4>
                          <span className="">{option.price_ttc} €</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })
            : "---"}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
