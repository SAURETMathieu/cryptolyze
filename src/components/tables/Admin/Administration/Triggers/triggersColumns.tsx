"use client";

import * as column from "@/src/components/tables/columns";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import {
  toggleTriggerStatus,
  TriggerType,
} from "@/src/store/admin/trigger.store";
import { getTriggerTypeBadges } from "@/src/utils/getColorAndText/triggers";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";

import { Switch } from "@/components/ui/switch";

import { TriggersActions } from "./TriggersActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const searchText = filterValue.toLowerCase();

  return name?.toLowerCase().includes(searchText);
};

export const createColumns = (t: MessagesIntl): ColumnDef<any>[] => [
  column.createSelectColumn(),

  column.createStringColumn({
    id: "name",
    accessorKey: "trigger_name",
    title: t("name"),
    className: "max-w-[200px]",
    textClassName: "truncate",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "table",
    accessorKey: "table_name",
    title: t("table"),
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "schema",
    accessorKey: "table_schema",
    title: t("schema"),
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "function",
    accessorKey: "function_name",
    className: "max-w-[200px]",
    textClassName: "truncate",
    title: t("function"),
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createBadgeColumn({
    id: "timing",
    accessorKey: "trigger_timing",
    title: t("timing"),
    className: "rounded-full px-2 w-[100px]",
    enableHiding: true,
    enableSorting: false,
    variantFn: (row) =>
      row.original.trigger_timing === "BEFORE" ? "yellowLight" : "purpleLight",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  }),

  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      return (
        <div className="flex items-center gap-2">
          {getTriggerTypeBadges(datas)}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  column.createBadgeColumn({
    id: "scope",
    accessorKey: "trigger_scope",
    title: t("scope"),
    className: "rounded-full px-2 w-[100px]",
    enableHiding: true,
    enableSorting: false,
    variantFn: (row) =>
      row.original.trigger_scope === "EACH ROW" ? "coolGrayLight" : "skyLight",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  }),

  {
    id: "enabled",
    accessorKey: "enabled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const datas: TriggerType = row.original;
      const enabled = datas.enabled;
      return (
        <div className="flex items-center justify-center">
          <Switch
            checked={enabled === "O"}
            onCheckedChange={() => {
              toggleTriggerStatus(datas);
            }}
          />
          {enabled === "O" ? (
            <CheckCircle2 className="ml-2 size-4 text-green-700" />
          ) : (
            <XCircle className="ml-2 size-4 text-red-700" />
          )}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  column.createHiddenColumn({
    id: "types",
    accessorKey: "types",
    title: "Types",
    filterFn: (row, id, value) => {
      const rowTypes = row.getValue(id) as string;
      const filterTypes = value as string[];
      if (!filterTypes.length) return true;
      return filterTypes.some((type) => rowTypes.includes(type));
    },
  }),

  {
    id: "actions",
    cell: ({ row }) => <TriggersActions row={row} />,
  },
];
