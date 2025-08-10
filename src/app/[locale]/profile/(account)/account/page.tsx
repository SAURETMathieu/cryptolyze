import { Metadata } from "next";
import AccountInfos from "@/src/components/pages/HUB/Account/AccountInfos";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("accountInfos"),
  };
}

export default async function AccountPage(props: PageProps) {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "AccountInfosPage" });

  return <AccountInfos t={t} />;
}
