"use client";

import { useTransition } from "react";
import { canSendNewConfirmationEmail } from "@/src/app/actions/auth";
import { getBannedUserInfos } from "@/src/app/actions/profile";
import CustomAlert from "@/src/components/alerts/CustomAlert";
import AutoForm from "@/src/components/auto-form";
import {
  fieldConfig,
  generateLoginFormSchema,
} from "@/src/components/forms/Hub/AuthForms/loginFormConfig";
import { useModal } from "@/src/context/modalProvider";
import { useRouter } from "@/src/i18n/navigation";
import { supabaseClient } from "@/src/lib/supabase/client";
import { translateMessage } from "@/src/utils/string/translateErrorMessage";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

const LoginForm = () => {
  const t = useTranslations("Forms");
  const tAuth = useTranslations("Login");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { openModal, setTitle } = useModal();

  const handleSubmit = async (
    data: z.infer<ReturnType<typeof generateLoginFormSchema>>
  ) => {
    startTransition(async () => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (error) {
        if (error.code === "email_not_confirmed") {
          const { success: emailCanBeSend, message } =
            await canSendNewConfirmationEmail(data.email);
          if (!emailCanBeSend) {
            toast.error(
              translateMessage(
                message,
                tAuth("error_while_resending_confirmation_email")
              )
            );
            return;
          }
          const { error: resendError } = await supabaseClient.auth.resend({
            type: "signup",
            email: data.email,
          });
          if (resendError) {
            toast.error(tAuth("error_while_resending_confirmation_email"));
          } else {
            toast.success(tAuth("confirmation_email_sent"));
          }
        } else {
          if (error.code === "user_banned") {
            const {
              data: bannedInfos,
              success,
              message,
            } = await getBannedUserInfos(data.email, data.password);

            if (!success && message === "invalid_credentials") {
              toast.error(tAuth("invalid_credentials"));
              return;
            }

            const messageForAlert = success ? (
              <>
                <p className="mb-2 font-bold">
                  {tAuth("banned_until", {
                    date: bannedInfos?.user_banned_until
                      ? new Date(bannedInfos.user_banned_until).toLocaleString()
                      : tAuth("unknown_date"),
                  })}
                </p>
                <p>
                  {translateMessage(
                    bannedInfos?.ban_reason_message ?? "",
                    tAuth("unknown_ban_reason")
                  )}
                </p>
              </>
            ) : (
              tAuth(error.code as any)
            );

            setTitle(tAuth("user_banned"));
            openModal(<CustomAlert message={messageForAlert} variant="red" />);
          } else {
            toast.error(tAuth("invalid_credentials"));
          }
        }
      } else {
        router.replace("/profile");
      }
    });
  };

  return (
    <AutoForm
      formSchema={generateLoginFormSchema(t)}
      fieldConfig={fieldConfig(t)}
      onSubmit={(values) => handleSubmit(values)}
      isDisabled={isPending}
      submitButtonValue={t("login")}
      resetButtonValue={t("reset")}
    ></AutoForm>
  );
};

export default LoginForm;
