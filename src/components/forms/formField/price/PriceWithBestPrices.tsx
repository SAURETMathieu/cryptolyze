"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import PriceInput from "./PriceInputForm";

export default function PriceWithBestPrices({
  form,
  isPending,
  lastPurchase,
  bestPrice,
}: {
  form: any;
  isPending: boolean;
  lastPurchase: number | null | undefined;
  bestPrice: number | null | undefined;
}) {
  const tForms = useTranslations("Forms");
  const { watch } = useFormContext();
  const vat = watch("vat");
  const handleChangePriceValue = async (val: number | undefined) => {
    if (val === undefined) return;
    form.setValue("price", val);
  };

  const adjustedBestPrice =
    vat === "0"
      ? bestPrice
        ? (bestPrice / 1.2).toFixed(2)
        : null
      : bestPrice?.toFixed(2);

  const adjustedLastPurchase =
    vat === "0"
      ? lastPurchase
        ? (lastPurchase / 1.2).toFixed(2)
        : null
      : lastPurchase?.toFixed(2);

  return (
    <>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem className="mx-auto flex flex-col items-center justify-evenly">
            <FormControl>
              <PriceInput
                form={form}
                isPending={isPending}
                name="price"
                label={tForms("priceLabel")}
                withCents
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full justify-center gap-2">
        <div
          className={`border-input w-full border p-2 text-center text-sm ${
            adjustedBestPrice
              ? "hover:ring-ring cursor-pointer hover:ring-1"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() =>
            adjustedBestPrice &&
            handleChangePriceValue(Number(adjustedBestPrice))
          }
          aria-disabled={!adjustedBestPrice}
        >
          <span className="block"> {tForms("bestPriceLabel")}</span>
          <span className="block font-bold">
            {" "}
            {adjustedBestPrice ?? "--"} €
          </span>
        </div>
        <div
          className={`border-input w-full border p-2 text-center text-sm ${
            adjustedLastPurchase
              ? "hover:ring-ring cursor-pointer hover:ring-1"
              : "cursor-not-allowed opacity-50"
          }`}
          onClick={() =>
            adjustedLastPurchase &&
            handleChangePriceValue(Number(adjustedLastPurchase))
          }
          aria-disabled={!adjustedLastPurchase}
        >
          <span className="block"> {tForms("lastPurchaseLabel")}</span>
          <span className="block font-bold">
            {" "}
            {adjustedLastPurchase ?? "--"} €
          </span>
        </div>
      </div>
    </>
  );
}
