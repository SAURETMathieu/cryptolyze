"use client";

import { useEffect, useState } from "react";
import NavigationLink from "@/src/components/link/NavigationLink";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type ClientRedirectProps = {
  redirectUrl: string;
  duration?: number;
  title: string;
  description: string;
  footerText: string;
};

export default function ClientRedirect({
  redirectUrl,
  duration = 3000,
  title,
  description,
  footerText,
}: ClientRedirectProps) {
  const [count, setCount] = useState(duration / 1000);
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const tRegister = useTranslations("EmailVerifyPage");
  setTimeout(() => {
    window.location.href = baseUrl + redirectUrl;
  }, duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-main max-h-main mx-auto mt-20 flex-1">
      <Card className="mx-auto w-full max-w-screen-sm p-2 sm:p-4">
        <CardContent className="space-y-4 p-4 text-center">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="space-y-4">
            {count === 0 ? (
              <div className="flex h-8 items-center justify-center space-x-2">
                <div className="size-4 animate-pulse rounded-full bg-green-600"></div>
                <span className="font-medium text-green-700">
                  {tRegister("redirecting")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-muted-foreground text-sm">
                  {tRegister("redirectingIn")}
                </span>
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                  {count}
                </span>
                <span className="text-muted-foreground text-sm">
                  {tRegister("second")}
                  {count > 1 ? "s" : ""}
                </span>
              </div>
            )}

            <NavigationLink
              href={redirectUrl}
              className="text-foreground hover:text-muted-foreground block text-center underline"
            >
              <Button className="w-1/2 rounded-lg px-4 py-2 font-medium">
                {tRegister("redirectText")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </NavigationLink>
          </div>

          <p className="text-muted-foreground mt-2 text-xs">{footerText}</p>
        </CardContent>
      </Card>
    </main>
  );
}
