import Image from "next/image";
import left_login_form_img from "@/public/left_login_form.png";
import { SignUpForm } from "@/src/components/forms/Hub/AuthForms/SignUpForm";

import NavigationLink from "@/components/link/NavigationLink";

export default function SignupPage({ t }: { t: MessagesIntl }) {
  return (
    <main className="min-h-main flex-1">
      <section className="min-h-main grid w-full grid-cols-1 md:grid-cols-2 ">
        <div className="sticky left-0 top-0 hidden max-h-screen md:block">
          <Image
            src={left_login_form_img}
            alt="Limited Resell"
            className="size-full object-cover"
            priority
          />
        </div>
        <div className="m-auto flex w-full flex-col p-4 lg:pb-20">
          <h1 className="pb-4 text-center text-3xl font-bold">{t("title")} </h1>
          <div className="mx-auto w-full max-w-[450px]">
            <SignUpForm />
            <span className="mt-4 block">{t("description")}</span>
            <NavigationLink
              href="/login"
              className="text-foreground hover:text-muted-foreground underline"
              aria-label={t("ariaLogin")}
            >
              {t("loginLink")}
            </NavigationLink>
          </div>
        </div>
      </section>
    </main>
  );
}
