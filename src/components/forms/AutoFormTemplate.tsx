"use client";

import { useTransition } from "react";
import AutoForm from "@/src/components/auto-form";
import { OnEditType } from "@/src/components/forms/formsFunction/onEdit";
import { OnSubmitType } from "@/src/components/forms/formsFunction/onSubmit";
import { useModal } from "@/src/context/modalProvider";
import { useLocale, useTranslations } from "next-intl";

import { AutoFormTemplateProps } from "@/types";

const AutoFormTemplate = <T extends { id?: string | number }>({
  datas = undefined,
  formSchema,
  fieldConfig,
  closeSheet,
  handleUpdateClient,
  onSubmit,
  fetchMethod,
  successMessage,
  errorMessage,
}: AutoFormTemplateProps<T>) => {
  const { closeModal } = useModal();
  const t = useTranslations("Forms");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleSubmit = async (values: T) => {
    startTransition(async () => {
      if (datas?.id) {
        await (onSubmit as OnEditType)(
          values,
          fetchMethod,
          handleUpdateClient,
          closeModal,
          datas.id,
          successMessage,
          errorMessage
        );
      } else {
        await (onSubmit as OnSubmitType)(
          values,
          fetchMethod,
          handleUpdateClient,
          closeModal,
          successMessage,
          errorMessage
        );
      }
    });
  };

  const handleCloseSheet = closeSheet || closeModal;

  return (
    <AutoForm
      formSchema={formSchema(t, locale, datas)}
      fieldConfig={fieldConfig(t)}
      onSubmit={(values) => handleSubmit(values)}
      isDisabled={isPending}
      closeSheet={handleCloseSheet}
      submitButtonValue={t("submit")}
      resetButtonValue={t("reset")}
    />
  );
};

export default AutoFormTemplate;
