"use client";

import { supabaseClient } from "@/src/lib/supabase/client";
import { formatDateToYYYYMMDD } from "@/src/utils";
import { capitalizeEach } from "@/src/utils/string/capitalize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CheckboxInput from "@/components/forms/formField/boolean/CheckboxInputForm";
import DateSinglePicker from "@/components/forms/formField/date/DateSinglePicker";
import { PasswordInput } from "@/components/forms/formField/string/PasswordInputForm";
import StringInput from "@/components/forms/formField/string/StringInputForm";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { signUpFormSchema, SignUpFormSchemaType } from "./signUpFormConfig";

export function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const tForm = useTranslations("Forms");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const locale = useLocale();

  const formSchema = signUpFormSchema(tForm);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (datas: SignUpFormSchemaType) => {
    setIsPending(true);
    const birthdate = formatDateToYYYYMMDD(datas.birthdate);
    try {
      const { error, data: response } = await supabaseClient.auth.signUp({
        email: datas.email.toLowerCase(),
        password: datas.password,
        options: {
          data: {
            first_name: capitalizeEach(datas.firstname),
            last_name: datas.lastname?.toUpperCase(),
            birth_date: birthdate,
            accept_terms_at: new Date(),
            language: locale,
          },
        },
      });
      if (error) {
        if (error?.code === "user_already_exists") {
          toast.error(tForm("signupAlreadyExist"));
        } else {
          toast.error(tForm("signupError"));
        }
      } else {
        if (response?.user?.identities?.length) {
          toast.success(tForm("signupSuccess"), {
            duration: 5000,
          });
          setSignUpSuccess(true);
        } else {
          toast.error(tForm("signupAlreadyExist"));
        }
      }
    } catch (error: any) {
      toast.error(tForm("signupError"));
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <>
      {signUpSuccess ? (
        <div className="">
          <h2>{tForm("signupSuccess")}</h2>
        </div>
      ) : (
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
            <StringInput
              form={form}
              name="email"
              label={tForm("emailLabel")}
              placeholder={"john.doe@email.com"}
              autoComplete="email"
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
                  {tForm.rich("acceptTermsDescription", {
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
                  {isPending ? <LoadIcon size={24} /> : tForm("signupSubmit")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
