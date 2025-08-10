import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

type PageProps = {
  params: any;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("resetPassword"),
  };
}

export default async function ForgotPasswordPage(props: PageProps) {
  const params = await props.params;

  const { locale } = params;

  return <ForgotPasswordForm />;
}
