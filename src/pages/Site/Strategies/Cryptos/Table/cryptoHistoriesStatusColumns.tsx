"use client";

import { Fragment } from "react";
import * as column from "@/src/components/tables/columns";
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { getCryptoHistoryCompleteness } from "@/src/utils/getCryptoHistoryCompleteness";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";

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
        <div className="flex items-center gap-2 justify-center">
          {datas.history_completeness &&
            Object.entries(datas.history_completeness)
              .slice(-7)
              .map(([year, is_complete], index) => (
                <Fragment key={year}>
                  {index !== 0 && <Separator orientation="vertical" className="h-10" />}
                  <div className="flex items-center flex-col gap-1">
                    <h2 className="text-sm font-bold">{year}</h2>
                    {is_complete ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </Fragment>
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
