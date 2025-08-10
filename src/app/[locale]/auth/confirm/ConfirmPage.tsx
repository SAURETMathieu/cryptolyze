"use client";

import { useEffect } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { EmailOtpType } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import Loading from "./Loading";
import ClientRedirect from "./redirect";

export default function ConfirmPage({
  type,
  token_hash,
}: {
  type: EmailOtpType;
  token_hash: string;
}) {
  const t = useTranslations("EmailVerifyPage");
  const router = useRouter();

  const verifyToken = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      router.replace("/auth-error-code");
      return;
    }
    if (type === "email_change") {
      toast.success(t("emailChanged"));
      router.replace("/profile");
      return;
    }
    if (type === "recovery") {
      router.replace("/reset-password");
      return;
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (type !== "signup") {
    return <Loading />;
  }

  return (
    <ClientRedirect
      redirectUrl="/register"
      duration={5000}
      title={t("title")}
      description={t("description")}
      footerText={t("footer")}
    />
  );
}
