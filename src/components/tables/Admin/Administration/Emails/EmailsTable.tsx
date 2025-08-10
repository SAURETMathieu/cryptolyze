"use client";

import { useEffect } from "react";
import { createColumns } from "@/src/components/tables/Admin/Administration/Emails/emailsColumns";
import Table from "@/src/components/tables/Table";
import { fetchEmails, useAdminEmailStore } from "@/src/store/admin/email.store";
import {
  fetchTriggers,
  useAdminTriggerStore,
} from "@/src/store/admin/trigger.store";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { ColumnConfig } from "@/types/datasTable";
import { DataTableSkeleton } from "@/components/tables/DataTableSkeleton";

export function EmailsTable() {
  const tTable = useTranslations("Tables");
  const emails = useAdminEmailStore((state) => state.emails);
  const emailsFetched = useAdminEmailStore((state) => state.emailsFetched);
  const triggerFetched = useAdminTriggerStore((state) => state.triggerFetched);
  const setTriggerFetched = useAdminTriggerStore(
    (state) => state.setTriggerFetched
  );

  const columnConfigs: ColumnConfig[] = [
    {
      id: "status",
      title: "Activé",
      options: [
        { value: true as any, label: "Activé" },
        { value: false as any, label: "Désactivé" },
      ],
      Icon: CheckCircle,
    },
  ];

  useEffect(() => {
    fetchEmails();
    if (!triggerFetched) {
      fetchTriggers().finally(() => {
        setTriggerFetched(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!emailsFetched) {
    return (
      <DataTableSkeleton
        columns={createColumns(tTable)}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={6}
        cellHeights={50}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  return (
    <Table
      data={emails}
      columns={createColumns(tTable)}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "key",
        placeholder:
          tTable("filter") + " " + tTable("by") + " " + tTable("key"),
      }}
      hideColumns={{ types: false }}
      hideExport
    />
  );
}
