"use client";

import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

import { LoadIcon } from "@/components/icons/LoadIcon";

export default function SubmitButtons({
  isPending,
  defaultValues,
  form,
  isUpdate = false,
}: {
  isPending: any;
  defaultValues: any;
  form: any;
  isUpdate?: boolean;
}) {
  const tForms = useTranslations("Forms");
  const submitButtonText = isUpdate ? tForms("validate") : tForms("create");
  return (
    <div className="flex w-full justify-between gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        className="w-full"
        onClick={() => form.reset(defaultValues)}
      >
        {tForms("reset")}
      </Button>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <LoadIcon size={24} /> : submitButtonText}
      </Button>
    </div>
  );
}
