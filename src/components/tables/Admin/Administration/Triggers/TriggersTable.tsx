"use client";

import { useEffect } from "react";
import { createColumns } from "@/src/components/tables/Admin/Administration/Triggers/triggersColumns";
import Table from "@/src/components/tables/Table";
import {
  fetchTriggers,
  useAdminTriggerStore,
} from "@/src/store/admin/trigger.store";
import { CheckCircle, DatabaseZap, SearchCode, Watch } from "lucide-react";
import { useTranslations } from "next-intl";

import { ColumnConfig } from "@/types/datasTable";
import { DataTableSkeleton } from "@/components/tables/DataTableSkeleton";

export default function TriggersTable() {
  const tTable = useTranslations("Tables");
  const triggers = useAdminTriggerStore((state) => state.triggers);
  const triggerFetched = useAdminTriggerStore((state) => state.triggerFetched);

  const triggersWithBadges = triggers.map((trigger) => {
    const types = [
      trigger.on_delete && "delete",
      trigger.on_insert && "insert",
      trigger.on_update && "update",
      trigger.on_truncate && "truncate",
    ]
      .filter(Boolean)
      .join(",");

    return {
      ...trigger,
      id: trigger.trigger_name + trigger.table_schema + trigger.table_name,
      types,
    };
  });

  const typeOptions = [
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
    { value: "insert", label: "Insert" },
    { value: "truncate", label: "Truncate" },
  ];

  const scopeOptions = [
    { value: "EACH ROW", label: "Each Row" },
    { value: "STATEMENT", label: "Statement" },
  ];

  const timingOptions = [
    { value: "BEFORE", label: "Before" },
    { value: "AFTER", label: "After" },
    { value: "INSTEAD OF", label: "Instead Of" },
  ];

  const columnConfigs: ColumnConfig[] = [
    {
      id: "types",
      title: "Types",
      options: typeOptions,
      Icon: DatabaseZap,
    },
    {
      id: "enabled",
      title: "Activé",
      options: [
        { value: "O" as any, label: "Activé" },
        { value: "D" as any, label: "Désactivé" },
      ],
      Icon: CheckCircle,
    },
    {
      id: "scope",
      title: "Scope",
      options: scopeOptions,
      Icon: SearchCode,
    },
    {
      id: "timing",
      title: "Timing",
      options: timingOptions,
      Icon: Watch,
    },
  ];

  useEffect(() => {
    fetchTriggers();
  }, []);

  if (!triggerFetched) {
    return (
      <DataTableSkeleton
        columns={createColumns(tTable)}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={6}
        cellHeights={57}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  return (
    <Table
      data={triggersWithBadges}
      columns={createColumns(tTable)}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: tTable("name"),
      }}
      hideColumns={{ types: false }}
      hideExport
    />
  );
}
