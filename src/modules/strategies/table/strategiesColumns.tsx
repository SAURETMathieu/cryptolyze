"use client";

import { Fragment } from "react";
import * as column from "@/src/components/tables/columns";
import { Separator } from "@/src/components/ui/separator";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { StrategiesActions } from "./StrategiesActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const key = row.getValue("key") as string;
  const searchText = filterValue.toLowerCase();

  return key?.toLowerCase().includes(searchText);
};

export const createColumns = (t: MessagesIntl): ColumnDef<any>[] => [
  // column.createSelectColumn(),

  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      return (
        <div className="flex flex-col items-start justify-center">
          <p className="text-md font-bold">
            {datas.name}{" "}
            <span className="text-sm text-primary">(x{datas.multiplier})</span>
          </p>
          <p className="text-sm text-muted-foreground">{datas.description}</p>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  column.createStringColumn({
    id: "execution_delay",
    accessorKey: "execution_delay",
    title: t("execution_delay"),
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "nb_tests",
    accessorKey: "nb_tests",
    title: t("nb_tests"),
    enableSorting: true,
    enableHiding: true,
  }),

  {
    id: "percent_per_trade",
    accessorKey: "percent_per_trade",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="percent_per_trade"
        className="w-[100px]"
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      return (
        <div className="flex items-center justify-between font-bold gap-1 w-[75px] max-w-[75px]">
          <span className="text-red-600 flex items-center justify-start w-[35px] max-w-[35px] min-w-[35px]">
            {datas.percent_per_trade_down}%
          </span>
          |
          <span className="text-green-600 flex items-center justify-end w-[35px] max-w-[35px] min-w-[35px]">
            {datas.percent_per_trade_up}%
          </span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  {
    id: "average_performances",
    accessorKey: "average_performances",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("average_performances")}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      return (
        <div className="flex items-center gap-2 justify-center">
          {datas.strategy_tests &&
            Object.entries(datas.strategy_tests)
              .slice(-7)
              .map(([year, status], index) => (
                <Fragment key={year}>
                  {index !== 0 && (
                    <Separator orientation="vertical" className="h-10" />
                  )}
                  <div className="flex items-center flex-col gap-1">
                    <h2 className="text-sm font-bold">{year}</h2>
                    {status === "complete" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : status === "not_requested" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
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
    cell: ({ row }) => <StrategiesActions row={row} />,
  },
];
