import { Footer } from "@/src/components/layout/footer/Footer";
import {Header} from "@/src/components/layout/header/Header";
import { Toaster } from "@/src/components/ui/sonner";
import { DeleteModalProvider } from "@/src/context/deleteModalProvider";
import { ModalProvider } from "@/src/context/modalProvider";
import { ThemeProvider } from "@/src/context/themeProvider";
import { AuthProvider } from "@/src/context/userProvider";
import { TailwindIndicator } from "@/src/utils/tailwindIndicator";

import "@/styles/globals.css";

import { ReactNode } from "react";
import { Metadata } from "next";
import { FloatingToolbar } from "@/src/components/layout/FloatingDevToolbar";
import { TermsUpdateNotification } from "@/src/components/layout/TermsUpdateNotification";
import { ErpProvider } from "@/src/context/erpProvider";
import { routing } from "@/src/i18n/routing";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function generateMetadata(
  props: Omit<Props, "children">
): Promise<Metadata> {
  return {
    metadataBase: new URL(defaultUrl),
    title: "Cryptolize",
    description: "Gestion de vos cryptos",
    icons: {
      icon: "/bitcoin.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let { locale } = await params;
  setRequestLocale(locale);
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={GeistSans.className}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ErpProvider>
              <DeleteModalProvider>
                <ModalProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <div className="relative flex min-h-screen flex-col">
                      <Header />
                      {children}
                      <Toaster />
                      <TermsUpdateNotification />
                      <SpeedInsights />
                      <Footer />
                    </div>
                    <TailwindIndicator />
                    <FloatingToolbar />
                  </ThemeProvider>
                </ModalProvider>
              </DeleteModalProvider>
            </ErpProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
