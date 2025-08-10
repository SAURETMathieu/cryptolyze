"use client";

import { Dispatch, SetStateAction } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { CsvImporterPropsType } from "./csv-importer";

export function ErrorCsvImport<T>({
  failedImports,
  resetErrors,
  setOpen,
  recommendations,
  errorAlertTitle,
  errorAlertDescription,
  errorItemCard,
  fields,
}: {
  failedImports: any;
  resetErrors: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  recommendations: string[];
  errorAlertTitle: string;
  errorAlertDescription: string;
  errorItemCard: (item: any, index: number) => React.ReactNode;
  fields: CsvImporterPropsType<T>["fields"];
}) {
  const totalFailed = failedImports.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  const totalItems = failedImports.length;
  const tTable = useTranslations("Tables");

  const handleExport = () => {
    const headers = fields.map((field) => field.value);
    const csvContent = [
      headers.join(","),
      ...failedImports.map((item: any) =>
        fields.map((field) => item[field.value]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const now = new Date().getTime();
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `failed_imports_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <DialogHeader className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-xl font-semibold">
              {tTable("success_partially")}
            </DialogTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {tTable("line_not_imported_total", { totalLines: totalItems })}
            </p>
          </div>
        </div>
      </DialogHeader>

      <div className="w-full space-y-6">
        <Alert className="flex border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/10 [&>svg~*]:pl-1 sm:[&>svg~*]:pl-4">
          <AlertTriangle className="my-auto ml-1 hidden size-4 text-amber-600 sm:block dark:text-amber-400" />
          <AlertDescription className="text-amber-800 sm:max-w-[400px] dark:text-amber-200">
            <strong>{errorAlertTitle}</strong>
            <span className="block">{errorAlertDescription}</span>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{tTable("lines_not_imported")}</h3>
            <Badge
              variant="destructive"
              className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 dark:bg-red-900/20 dark:text-red-400"
            >
              {totalFailed} {tTable("items")}
            </Badge>
          </div>

          <ScrollArea className="h-48 rounded-md border">
            <div className="space-y-3 p-4">
              {failedImports.map((item: any, index: number) =>
                errorItemCard(item, index)
              )}
            </div>
          </ScrollArea>
        </div>

        {recommendations.length > 0 && (
          <div className="bg-muted/30 rounded-lg border p-4">
            <h4 className="mb-2 font-medium">{tTable("recommendations")}</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              {recommendations.map((recommendation) => (
                <li key={recommendation}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        )}
        <Separator />

        <div className="flex justify-between gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExport}
              aria-label={tTable("ariaExportCsvErrorsButton")}
              title={tTable("ariaExportCsvErrorsButton")}
            >
              <Download className="size-4" />
              <span className="hidden sm:block">{tTable("export")}</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => resetErrors()}
              aria-label={tTable("ariaBackCsvErrorsButton")}
              title={tTable("ariaBackCsvErrorsButton")}
            >
              {tTable("back")}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              aria-label={tTable("ariaCloseCsvErrorsButton")}
              title={tTable("ariaCloseCsvErrorsButton")}
            >
              {tTable("close")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
