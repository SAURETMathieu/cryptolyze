import { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmailOtpType } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";

import ConfirmPage from "./ConfirmPage";

type PageProps = {
  params: any;
  searchParams: any;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("tokenVerification"),
  };
}

export default async function EmailConfirmPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale } = params;

  const { token_hash, type } = searchParams;

  if (!token_hash || !type) {
    redirect("/auth-error-code");
  }

  return (
    <ConfirmPage
      type={type as EmailOtpType}
      token_hash={token_hash as string}
    />
  );
}
