import { Metadata } from "next";
import { HomeMain } from "@/src/pages/Site/Home/HomeMain";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("home"),
  };
}

export default async function HomePage() {
  return <HomeMain />;
}
