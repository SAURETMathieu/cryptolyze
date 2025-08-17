"use client";

import * as column from "@/src/components/tables/columns";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { getCryptoHistoryCompleteness } from "@/src/utils/getCryptoHistoryCompleteness";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { CryptoHistoriesStatusActions } from "./CryptoHistoriesStatusActions";

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
    enableHiding: true,
  }),

  column.createNameAndSkuColumn({
    id: "name",
    accessorKey: "name",
    skuAccessorKey: "asset",
    title: t("name"),
    className: "max-w-[120px] md:max-w-[150px] lg:max-w-[200px]",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
    withCopyName: false,
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
      <DataTableColumnHeader
        column={column}
        title={t("history_completeness")}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;

      return (
        <div className="flex items-center gap-2">
          <Progress
            value={getCryptoHistoryCompleteness(datas.history_completeness)}
            className="w-16 h-3"
          />
          <span className="text-sm">
            {Math.round(
              getCryptoHistoryCompleteness(datas.history_completeness)
            )}
            %
          </span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "years",
    accessorKey: "history_completeness",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("years")} />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      return (
        <div className="flex items-center gap-2">
          {datas.history_completeness &&
            Object.entries(datas.history_completeness)
              .slice(-5)
              .map(([year, is_complete]) => (
                <div key={year} className="flex items-center flex-col gap-2">
                  <h2 className="text-sm font-bold">{year}</h2>
                  <Badge
                    variant={is_complete ? "green" : "red"}
                    className="rounded-lg"
                  >
                    {is_complete ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              ))}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <CryptoHistoriesStatusActions row={row} />,
  },
];
