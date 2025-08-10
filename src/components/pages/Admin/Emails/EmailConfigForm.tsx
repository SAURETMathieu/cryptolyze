"use client";

import { useEffect, useState } from "react";
import {
  insertEmailConfig,
  updateEmailConfig,
} from "@/src/app/actions/admin/email";
import { useModal } from "@/src/context/modalProvider";
import {
  EmailType,
  insertEmailStore,
  updateEmailStore,
} from "@/src/store/admin/email.store";
import { useAdminTriggerStore } from "@/src/store/admin/trigger.store";
import { getTriggerColors, translateMessage } from "@/src/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SwitchInput from "@/components/forms/formField/boolean/SwitchInputForm";
import { MultipleSelectorInput } from "@/components/forms/formField/select/MultipleSelectorTemplateInputForm";
import StringInput from "@/components/forms/formField/string/StringInputForm";
import TextAreaInput from "@/components/forms/formField/string/TextAreaInputForm";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";

import {
  EmailConfigSchemaType,
  generateEmailConfigSchema,
} from "./emailConfigFormConfig";

interface TriggerOption {
  renderLabel: () => React.ReactNode;
  value: string;
  label: string;
}

export function EmailConfigForm({ email }: { email?: EmailType }) {
  const [isPending, setIsPending] = useState(false);
  const [triggersOptions, setTriggersOptions] = useState<TriggerOption[]>([]);
  const triggerFetched = useAdminTriggerStore((state) => state.triggerFetched);
  const triggers = useAdminTriggerStore((state) => state.triggers);
  const { closeModal, isOpen } = useModal();
  const tForm = useTranslations("Forms");

  const formSchema = generateEmailConfigSchema(tForm, email);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<EmailConfigSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    setTriggersOptions(
      triggers
        .filter((trigger) => trigger.trigger_name !== "handle_updated_at")
        .map((trigger) => ({
          renderLabel: () => (
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className="block max-w-[350px] truncate"
                title={trigger.trigger_name as string}
              >
                {trigger.trigger_name as string}
              </span>
              <div className="flex items-center gap-2">
                {getTriggerColors(trigger)}
              </div>
            </div>
          ),
          label: trigger.trigger_name as string,
          value: trigger.trigger_name as string,
        }))
    );
  }, [triggerFetched, triggers]);

  const onSubmit = async (datas: EmailConfigSchemaType) => {
    setIsPending(true);
    try {
      let success, data, message;
      if (email) {
        ({ success, data, message } = await updateEmailConfig(datas, email.id));
      } else {
        ({ success, data, message } = await insertEmailConfig(datas));
      }
      if (success && data) {
        if (email) {
          updateEmailStore(data, email.id);
          toast.success(
            "La configuration de l'email a été modifiée avec succès"
          );
        } else {
          insertEmailStore(data);
          toast.success("La configuration de l'email a été créée avec succès");
        }
        if (isOpen) {
          closeModal();
        }
      } else {
        console.error(message);
        toast.error(
          translateMessage(
            message,
            "Une erreur est survenue lors de la création de la configuration de l'email"
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      toast.error(translateMessage(error?.message, "defaultErrorMessage"));
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-4"
        noValidate
      >
        <SwitchInput
          form={form}
          name="status"
          containerClassName="absolute -top-8 right-0 flex items-center justify-center gap-2 space-y-0"
          label={"Actif ?"}
          isPending={isPending}
          onlyLabel
        />
        <StringInput
          form={form}
          name="key"
          label={"Key"}
          placeholder={"Key"}
          isPending={isPending}
          required
        />
        <StringInput
          form={form}
          name="description"
          label={"Description"}
          placeholder={"Envoi d'un email lorsque ..."}
          isPending={isPending}
          required
        />
        <TextAreaInput
          form={form}
          name="details"
          label={"Détails"}
          placeholder={"Détails"}
          className="h-[85px]"
          isPending={isPending}
          required
        />
        <MultipleSelectorInput
          form={form}
          name="triggers"
          label={"Triggers"}
          placeholder={"Choisir le(s) trigger(s)"}
          maxCount={1}
          options={triggersOptions}
          isPending={isPending || !triggerFetched}
          required
        />
        <StringInput
          form={form}
          name="n8n_name"
          label={"Nom du workflow n8n"}
          placeholder={"Nom du workflow"}
          isPending={isPending}
          required
        />
        <StringInput
          form={form}
          name="n8n_link"
          label={"Lien n8n"}
          placeholder={"https://..."}
          isPending={isPending}
          required
        />
        <StringInput
          form={form}
          name="n8n_endpoint"
          label={"Endpoint n8n"}
          placeholder={"https://..."}
          isPending={isPending}
          required
        />
        <StringInput
          form={form}
          name="n8n_event"
          label={"Event n8n"}
          placeholder={"Event"}
          isPending={isPending}
          required
        />
        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-full"
              onClick={handleReset}
            >
              {tForm("reset")}
            </Button>
            <Button
              type="submit"
              disabled={isPending || !triggerFetched}
              className="w-full"
            >
              {isPending || !triggerFetched ? (
                <LoadIcon size={24} />
              ) : (
                tForm("submit")
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
