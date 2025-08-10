import { updateSession } from "@/src/lib/supabase/middleware";
import { authentificationRoutes, privateRoutes } from "@/src/routes";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { locales } from "./config";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isPrivateRoute = (pathname: string) => {
  return privateRoutes.some((route) => {
    const routeRegex = new RegExp(
      `^${route
        .replace(/\[id\]/, "\\d+")
        .replace(/\*/g, ".*")
        .replace(/\/$/, "\\/?")}$`
    );
    return routeRegex.test(pathname);
  });
};

export async function middleware(request: NextRequest) {
  if (request?.nextUrl?.pathname?.startsWith("/customer")) {
    return NextResponse.next();
  }
  // Handle session updates
  const sessionResponse = await updateSession(request);

  // Handle i18n routing
  const i18nResponse = handleI18nRouting(request);

  // Redirect to the user's locale if it's not in the URL
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "fr";

  const { pathname } = request.nextUrl;
  const localePattern = new RegExp(`^/(${locales.join("|")})`);

  const url = request.nextUrl.clone();

  if (!localePattern.test(pathname)) {
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const user = sessionResponse.headers.get("user")
    ? JSON.parse(sessionResponse.headers.get("user")!)
    : null;

  const pathWithoutLocale = pathname.replace(localePattern, "");

  const isExactUrl = (routeArray: string[], path: string) => {
    return routeArray.some((route) => route === path);
  };

  // check if user has already filled starting form (pro/perso)
  if (user && user.profile) {
    const profile = user.profile;
    const infosVerified =
      profile?.accept_terms_at &&
      profile?.accept_terms_version &&
      profile?.accept_terms_history;
    if (!infosVerified && url.pathname !== `/${locale}/reset-password`) {
      url.pathname = `/${locale}/reset-password`;
      return NextResponse.redirect(url);
    }
    if (user.profile?.type) {
      if (url.pathname === `/${locale}/register`) {
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
    } else {
      if (
        url.pathname !== `/${locale}/register` &&
        url.pathname !== `/${locale}/reset-password`
      ) {
        url.pathname = `/${locale}/register`;
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect to the home page if the user is already logged in and trying to access the login or register page
  if (user && isExactUrl(authentificationRoutes, pathWithoutLocale)) {
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Redirect to the login page if the user is not logged in and trying to access a private route
  if (!user && isPrivateRoute(pathWithoutLocale)) {
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Redirect to the home page if the user is not an admin and trying to access the admin page
  if (
    pathname.startsWith(`/${locale}/admin`) &&
    user?.profile?.role !== "Team"
  ) {
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Combine the i18n and session responses
  const response = i18nResponse || sessionResponse;
  if (i18nResponse && sessionResponse) {
    const combinedResponse = NextResponse.next();

    i18nResponse.headers.forEach((value, key) => {
      combinedResponse.headers.set(key, value);
    });
    sessionResponse.headers.forEach((value, key) => {
      if (key !== "user") {
        combinedResponse.headers.set(key, value);
      }
    });

    return combinedResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots).*)",
  ],
};
