"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/userProvider";
import { useRouter } from "@/src/i18n/navigation";
import { supabaseClient } from "@/src/lib/supabase/client";
import { formatDateToYYYYMMDD } from "@/src/utils";
import { capitalizeEach } from "@/src/utils/string/capitalize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CheckboxInput from "@/components/forms/formField/boolean/CheckboxInputForm";
import DateSinglePicker from "@/components/forms/formField/date/DateSinglePicker";
import { PasswordInput } from "@/components/forms/formField/string/PasswordInputForm";
import StringInput from "@/components/forms/formField/string/StringInputForm";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";

import {
  generateResetInfosFormSchema,
  ResetInfosFormSchemaType,
} from "./ResetInfosFormConfig";

export function ResetInfosForm() {
  const [isPending, setIsPending] = useState(false);
  const tForm = useTranslations("Forms");
  const locale = useLocale();
  const { profile, setProfile, setUser, user } = useAuth();
  const router = useRouter();

  const formSchema = generateResetInfosFormSchema(tForm, profile);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<ResetInfosFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (datas: ResetInfosFormSchemaType) => {
    setIsPending(true);
    const birthdate = formatDateToYYYYMMDD(datas.birthdate);
    try {
      const { error, data: response } = await supabaseClient.auth.updateUser({
        password: datas.password,
        data: {
          first_name: capitalizeEach(datas.firstname),
          last_name: datas.lastname?.toUpperCase(),
          birth_date: birthdate,
          accept_terms_at: new Date(),
          language: locale,
        },
      });
      if (error) {
        throw new Error("something_went_wrong");
      } else {
        if (response?.user?.identities?.length) {
          toast.success(tForm("infos_updated_successfully"), {
            duration: 5000,
          });
          const { data, error } = await supabaseClient
            .from("profiles")
            .select(
              "accept_terms_version, accept_terms_history, accept_terms_at, language, first_name, last_name, birth_date"
            )
            .eq("id", profile?.id)
            .single();
          if (error) {
            throw new Error("something_went_wrong");
          }
          // Update auth context with the new user infos
          setProfile((prev: any) => ({
            ...prev,
            accept_terms_version: data?.accept_terms_version,
            accept_terms_history: data?.accept_terms_history,
            accept_terms_at: data?.accept_terms_at,
            language: data?.language,
            first_name: data?.first_name,
            last_name: data?.last_name,
            birth_date: data?.birth_date,
          }));
          setUser(response?.user);
          router.replace(`/profile/account`);
        } else {
          throw new Error("something_went_wrong");
        }
      }
    } catch (error: any) {
      toast.error(tForm("something_went_wrong"));
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
        className="space-y-4"
        noValidate
      >
        <StringInput
          form={form}
          name="firstname"
          label={tForm("firstnameLabel")}
          placeholder={"John"}
          autoComplete="given-name"
          isPending={isPending}
          required
        />
        <StringInput
          form={form}
          name="lastname"
          label={tForm("lastnameLabel")}
          placeholder={"Doe"}
          autoComplete="family-name"
          isPending={isPending}
          required
        />
        <DateSinglePicker
          form={form}
          name="birthdate"
          label={tForm("birthDateLabel")}
          locale={locale as "en" | "fr"}
          numberOfMonths={1}
          disabledDates={(date) =>
            date.getFullYear() > new Date().getFullYear() - 17
          }
          fromYear={new Date().getFullYear() - 110}
          toYear={new Date().getFullYear() - 18}
          isPending={isPending}
          required
        />
        <PasswordInput
          form={form}
          name="password"
          label={tForm("passwordLabel")}
          isPending={isPending}
          autoComplete="new-password"
          showValidations
          required
        />
        <PasswordInput
          form={form}
          name="passwordConfirm"
          label={tForm("confirmPasswordLabel")}
          autoComplete="new-password"
          isPending={isPending}
          required
        />
        <CheckboxInput
          form={form}
          name="accept"
          label={
            <div>
              {tForm.rich("acceptTermsDescriptionReset", {
                a: (chunk: React.ReactNode) => (
                  <a
                    href="/conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="underline"
                  >
                    {chunk}
                  </a>
                ),
                a2: (chunk: React.ReactNode) => (
                  <a
                    href="https://limitedresell.com/content/8-politique-de-confidentialite"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="underline"
                  >
                    {chunk}
                  </a>
                ),
              })}
            </div>
          }
          onCheckedChange={() => {}}
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
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <LoadIcon size={24} /> : tForm("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
