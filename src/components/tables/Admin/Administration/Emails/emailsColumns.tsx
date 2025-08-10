"use client";

import * as column from "@/src/components/tables/columns";
import { DataTableColumnHeader } from "@/src/components/ui/tools/dataTableColumnHeader";
import { EmailType, toggleEmailStatus } from "@/src/store/admin/email.store";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";

import { Switch } from "@/components/ui/switch";

import { EmailsActions } from "./EmailsActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const key = row.getValue("key") as string;
  const searchText = filterValue.toLowerCase();

  return key?.toLowerCase().includes(searchText);
};

export const createColumns = (t: MessagesIntl): ColumnDef<any>[] => [
  column.createSelectColumn(),

  column.createStringColumn({
    id: "key",
    accessorKey: "key",
    title: t("key"),
    className: "max-w-[200px]",
    textClassName: "truncate",
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "description",
    accessorKey: "description",
    title: t("description"),
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "n8n_name",
    accessorKey: "n8n_name",
    title: t("n8n_name"),
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "nb_send",
    accessorKey: "nb_send",
    title: t("nb_send"),
    labelFn: (text) => {
      return String(text);
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createDateColumn({
    id: "last_send_at",
    accessorKey: "last_send_at",
    title: t("last_send_at"),
    showTime: true,
    enableSorting: true,
  }),

  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const datas: EmailType = row.original;
      const enabled = datas.status;
      return (
        <div className="flex items-center justify-center">
          <Switch
            checked={enabled}
            onCheckedChange={() => {
              toggleEmailStatus(datas);
            }}
          />
          {enabled ? (
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
      if (value === true) {
        return value.includes(row.getValue(id));
      }
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <EmailsActions row={row} />,
  },
];
