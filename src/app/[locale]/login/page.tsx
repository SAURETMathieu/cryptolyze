import { Metadata } from "next";
import Login from "@/src/components/pages/HUB/Auth/Login";
import { redirect } from "@/src/i18n/navigation";
import { createServer } from "@/src/lib/supabase/server";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "TitlePages" });
  return {
    title: t("login"),
  };
}

export default async function LoginPage(props: PageProps) {
  const params = await props.params;

  const { locale } = params;

  const supabase = createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/profile", locale });
  }
  return <Login />;
}
