import { useEffect, useState } from "react";
import { DataTable } from "@/src/components/tables/DataTable";
import { DataTableSkeleton } from "@/src/components/tables/DataTableSkeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { createColumns } from "./cryptoHistoriesStatusColumns";

export function CryptoHistoriesStatusTable({
  cryptos,
  isFetching,
}: {
  cryptos: any[];
  isFetching: boolean;
}) {
  const tTable = useTranslations("Tables");

  // const columnConfigs: ColumnConfig[] = [
  // ];

  if (isFetching) {
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
    <Card>
      <CardHeader>
        <CardTitle>Historique des prix</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={cryptos}
          columns={createColumns(tTable)}
          // columnConfigs={columnConfigs}
          filterTextOptions={{
            id: "name",
            placeholder: tTable("name") + " " + tTable("asset"),
          }}
          // hideColumns={{ history_completeness: false }}
          hideExport
        />
      </CardContent>
    </Card>
  );
}
