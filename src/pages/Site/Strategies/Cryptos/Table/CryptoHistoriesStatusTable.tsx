import { DataTable } from "@/src/components/tables/DataTable";
import { DataTableSkeleton } from "@/src/components/tables/DataTableSkeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useCryptoHistoryStore } from "@/src/store/cryptoHistory.store";
import { useTranslations } from "next-intl";

import { createColumns } from "./cryptoHistoriesStatusColumns";

export function CryptoHistoriesStatusTable() {
  const cryptoHistories = useCryptoHistoryStore(
    (state) => state.cryptoHistories
  );
  const cryptoHistoriesFetched = useCryptoHistoryStore(
    (state) => state.cryptoHistoriesFetched
  );
  const tTable = useTranslations("Tables");

  // const columnConfigs: ColumnConfig[] = [
  // ];

  if (!cryptoHistoriesFetched) {
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
          data={cryptoHistories}
          columns={createColumns(tTable)}
          // columnConfigs={columnConfigs}
          filterTextOptions={{
            id: "name",
            placeholder: tTable("name") + " " + tTable("symbol"),
          }}
          showColumns={{ symbol: false }}
          hideExport
        />
      </CardContent>
    </Card>
  );
}
