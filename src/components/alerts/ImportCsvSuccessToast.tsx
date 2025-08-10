"use client";

import { Check, CheckCheck, Package, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function ImportCsvSuccessToast({
  importedLines,
  createdItems,
  successRate,
}: {
  importedLines: number;
  createdItems: number;
  successRate: number;
}) {
  const percent =
    successRate > 1 ? successRate?.toFixed(2) : (successRate * 100).toFixed(2);
  const tTable = useTranslations("Tables");
  return (
    <div className="flex w-full items-start gap-3">
      {successRate >= 1 ? (
        <CheckCheck className="mt-1 size-5" />
      ) : (
        <Check className="mt-1 size-5" />
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {successRate >= 1
              ? tTable("success_fully")
              : tTable("success_partially")}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <TrendingUp className="size-4" />
            <span>
              {tTable("line_imported_total", {
                totalLines: importedLines,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-orange-700">
            <Package className="size-4" />
            <span>
              {tTable("items")}: {createdItems}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-green-700 pt-2">
            <span className="text-sm">{tTable("success_rate")}</span>
            <span className="text-sm font-bold">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
