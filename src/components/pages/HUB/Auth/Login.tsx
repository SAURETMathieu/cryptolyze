"use client";

import { useEffect } from "react";
import Image from "next/image";
import left_login_form_img from "@/public/left_login_form.png";
import LoginForm from "@/src/components/forms/Hub/AuthForms/LoginForm";
import { useAuth } from "@/src/context/userProvider";
import { useTranslations } from "next-intl";

import NavigationLink from "@/components/link/NavigationLink";

export default function LoginPage() {
  const t = useTranslations("Login");
  const { setUser, setProfile } = useAuth();

  useEffect(() => {
    setUser(null);
    setProfile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-main max-h-main flex-1">
      <section className="h-main grid w-full grid-cols-1 md:grid-cols-2">
        <div className="max-h-main hidden md:block">
          <Image
            src={left_login_form_img}
            alt="Limited Resell"
            className="size-full  object-center"
          />
        </div>
        <div className="m-auto flex w-full flex-col p-4">
          <h1 className="w-full pb-4 text-center text-3xl font-bold">
            {t("title")}{" "}
          </h1>
          <div className="m-auto w-full max-w-[450px]">
            <LoginForm />
            <span className="mt-4 block">{t("description")}</span>
            <NavigationLink
              href="/signup"
              className="text-foreground hover:text-muted-foreground underline"
              aria-label={t("ariaSignup")}
            >
              {t("signupLink")}
            </NavigationLink>
          </div>
        </div>
      </section>
    </main>
  );
}
