"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { updateGlobalMessage } from "@/src/app/actions/config";
import TextAreaInput from "@/src/components/forms/formField/string/TextAreaInputForm";
import { LoadIcon } from "@/src/components/icons/LoadIcon";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { getCurrentGlobalMessage } from "@/src/utils/string/getCurrentGlobalMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import flags from "react-phone-number-input/flags";
import { toast } from "sonner";
import { z } from "zod";

import { getFormDefaultValues } from "../../utils/getFormDefaultValues";

const generateGlobalAlertSchema = (text: string | null) => {
  return z.object({
    message: z.string().default(text ?? ""),
  });
};

type GlobalAlertFormProps = z.infer<
  ReturnType<typeof generateGlobalAlertSchema>
>;

export default function GlobalAlertForm({
  globalAlertMessage,
  setGlobalMessage,
  lang,
}: {
  globalAlertMessage: string | null;
  setGlobalMessage: Dispatch<SetStateAction<string | null>>;
  lang: string;
}) {
  const tForms = useTranslations("Forms");
  const [isPending, setIsPending] = useState(false);

  const formSchema = generateGlobalAlertSchema(
    getCurrentGlobalMessage(globalAlertMessage, lang)
  );
  const defaultValues = getFormDefaultValues(formSchema);
  const form = useForm<GlobalAlertFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const flagKey = lang.toLowerCase() === "en" ? "GB" : lang.toUpperCase();
  const Flag = flags[flagKey as keyof typeof flags];

  const onSubmit = async (values: GlobalAlertFormProps) => {
    setIsPending(true);
    try {
      const { success, data: updatedGlobalMessage } = await updateGlobalMessage(
        values.message.trim(),
        globalAlertMessage,
        lang
      );
      if (success) {
        toast.success("Message mis à jour");
        setGlobalMessage(updatedGlobalMessage);
        return;
      } else {
        toast.error("Erreur lors de la mise à jour du message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du message");
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const handleClear = () => {
    form.reset({ message: "" });
  };

  return (
    <section className="my-8 w-full max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="flex items-center gap-2 text-xl">
            Langue:
            <span className="h-4 w-6">{Flag && <Flag title={lang} />}</span>
          </div>
          <TextAreaInput
            form={form}
            name="message"
            label="Global message"
            placeholder="Message..."
          />

          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={isPending}
            >
              {tForms("clear")}
            </Button>
            <Button
              type="reset"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isPending}
            >
              {tForms("reset")}
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <LoadIcon size={24} /> : tForms("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
