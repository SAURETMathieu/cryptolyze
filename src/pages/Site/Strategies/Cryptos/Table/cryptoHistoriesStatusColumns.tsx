"use client";

import * as column from "@/src/components/tables/columns";
import { Badge } from "@/src/components/ui/badge";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

// import { TriggersActions } from "./TriggersActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const searchText = filterValue.toLowerCase();

  return name?.toLowerCase().includes(searchText);
};

export const createColumns = (t: MessagesIntl): ColumnDef<any>[] => [
  column.createSelectColumn(),

  column.createImageColumn({
    id: "logo",
    accessorKey: "logo_url",
    title: t("logo"),
    altAccessorKey: "name",
    size: 40,
    className: "border-none",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "name",
    accessorKey: "name",
    title: t("name"),
    className: "max-w-[200px]",
    textClassName: "truncate",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "currency",
    accessorKey: "currency",
    title: t("currency"),
    enableSorting: true,
    enableHiding: true,
  }),

  {
    id: "history_completeness",
    accessorKey: "history_completeness",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="History Completeness" />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      return (
        <div className="flex items-center gap-2">
          {datas.history_completeness &&
            Object.entries(datas.history_completeness).map(
              ([year, is_complete]) => (
                <div className="flex items-center flex-col gap-2">
                  <h2 className="text-sm font-bold">{year}</h2>
                  <Badge
                    key={year}
                    variant={is_complete ? "green" : "red"}
                    className="rounded-lg"
                  >
                    {is_complete ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              )
            )}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <TriggersActions row={row} />,
  // },
];
