"use client";

import { ImportCsvSuccessToast } from "@/src/components/alerts/ImportCsvSuccessToast";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

type ImportCsvOptions<T> = {
  rawData: Record<string, unknown>[];
  schemaFn: (data: Record<string, unknown>[]) => z.ZodSchema<any>;
  formatFn: (item: Record<string, unknown>) => Record<string, unknown>;
  endpoint: string;
  messages: {
    noData?: string;
    apiError?: string;
  };
  onSuccess: (createdItems: T[]) => void;
  setErrors: (errors: any[]) => void;
  setImportErrors: (errors: any[]) => void;
  setShowImportErrors: (show: boolean) => void;
};

export function useHandleCsvImport<T>({
  rawData,
  schemaFn,
  formatFn,
  endpoint,
  messages,
  onSuccess,
  setErrors,
  setImportErrors,
  setShowImportErrors,
}: ImportCsvOptions<T>) {
  const tTable = useTranslations("Tables");
  const tForm = useTranslations("Forms");

  const handleImport = async () => {
    const formattedData = rawData.map(formatFn);
    const schema = schemaFn(formattedData);
    const result = schema.safeParse(formattedData);
    if (!result.success) {
      const errorRows =
        result.error.errors.map((err) => Number(err.path[0]) + 1) || [];
      const errorCountByRow = errorRows.reduce(
        (acc, row) => {
          acc[row] = (acc[row] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>
      );

      const uniqueErrorRows = Object.keys(errorCountByRow)
        .map(Number)
        .sort((a, b) => a - b);

      setErrors(result.error.errors);

      toast.error(
        <div className="flex w-full flex-col gap-1">
          <p className="text-center text-lg font-bold">{tTable("error")}(s)</p>
          <ul className="list-disc capitalize">
            {uniqueErrorRows.slice(0, 5).map((row, index) => (
              <li key={index} className="ml-4 text-sm">
                {tTable("row")} {row}: (
                {tForm("errors", { nbErrors: errorCountByRow[row] })})
              </li>
            ))}
          </ul>
          {uniqueErrorRows.length > 5 && (
            <p className="ml-4 text-sm font-medium">
              + {uniqueErrorRows.length - 5}{" "}
              {uniqueErrorRows.length - 5 > 1 ? tTable("rows") : tTable("row")}
            </p>
          )}
        </div>
      );
      return false;
    }

    setErrors([]);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(formattedData),
      });

      const { success, message, data, errors, status } = await response.json();

      if (!response.ok || !success || !data || data.length === 0) {
        toast.error(messages.noData ?? tTable("no_lines_inserted"), {
          duration: 5000,
        });
        return false;
      }

      const importedLines =
        (formattedData?.length ?? 0) - (errors?.length ?? 0);

      const totalItemsFailed = errors?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      const successRate =
        (data.length ?? 0) / ((data.length ?? 0) + (totalItemsFailed ?? 0));

      const toastMessage = (
        <ImportCsvSuccessToast
          importedLines={importedLines}
          createdItems={data.length}
          successRate={successRate}
        />
      );

      toast.success(toastMessage, {
        duration: 7000,
      });

      if (status === 207) {
        setImportErrors(errors);
        setShowImportErrors(true);
        onSuccess(data);
        return false;
      }

      onSuccess(data);
      return true;
    } catch (err) {
      toast?.error(messages.apiError ?? tTable("something_went_wrong"), {
        duration: 5000,
      });
      return false;
    }
  };

  return { handleImport };
}
