"use client";

import { useEffect, useState } from "react";
import { canSendRecoverPasswordEmail } from "@/src/app/actions/auth";
import { ResetInfosForm } from "@/src/components/forms/Hub/AuthForms/ResetInfosForm";
import { ResetPasswordFormContent } from "@/src/components/forms/Hub/AuthForms/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useAuth } from "@/src/context/userProvider";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export function ResetPasswordForm() {
  const { profile } = useAuth();
  const router = useRouter();
  const [isValidEmailToken, setIsValidEmailToken] = useState(false);
  const [isResetInfosForm, setIsResetInfosForm] = useState(false);
  const conditionAccepted =
    profile &&
    profile.accept_terms_version !== null &&
    profile.accept_terms_at !== null &&
    profile.accept_terms_history !== "";

  useEffect(() => {
    const verifyValidResetToken = async () => {
      if (!profile) return;
      const { success } = await canSendRecoverPasswordEmail(
        profile?.email?.toLowerCase()
      );

      // success is true if user can request a new recover password email, then we redirect to profile page because this reset password form should not be accessible
      if (success) {
        router.replace("/profile");
      } else {
        // if user can't request a new recover password email, that means user can reset password, because a token is currently valid
        if (conditionAccepted) {
          setIsValidEmailToken(true);
        } else {
          setIsResetInfosForm(true);
        }
      }
    };
    verifyValidResetToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.email]);

  const tReset = useTranslations("ResetPassword");

  const resetPasswordFormContent = ResetPasswordFormContent(
    tReset("success"),
    tReset("failure")
  );

  if (!isValidEmailToken && !isResetInfosForm) {
    return <main className="min-h-main p-4"></main>;
  }

  if (isResetInfosForm) {
    return (
      <main className="min-h-main p-4">
        <Card className="max-w-screen-s mx-auto mt-8 p-0">
          <CardHeader>
            <CardTitle>{tReset("resetInfos")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResetInfosForm />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-main p-4">
      <Card className="max-w-screen-s mx-auto mt-8 p-0">
        <CardHeader>
          <CardTitle>{tReset("recoverPassword")}</CardTitle>
        </CardHeader>
        <CardContent>{resetPasswordFormContent}</CardContent>
      </Card>
    </main>
  );
}
