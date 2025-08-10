import { Metadata } from "next";
import Signup from "@/src/components/pages/HUB/Auth/SignUp";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("signup"),
  };
}

export default async function SignUpPage(props: PageProps) {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "Signup" });
  return <Signup t={t} />;
}
