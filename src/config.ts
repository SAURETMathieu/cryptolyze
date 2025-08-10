export const defaultLocale = "fr" as const;
export const locales = ["fr", "en"] as const;

export type RouteType = "public" | "auth" | "private" | "api";

export const staticPathnames = {
  "/": "/",
  "/auth-error-code": "/auth-error-code",
  "/help": {
    en: "/help",
    fr: "/aide",
  },
  "/faq": "/faq",
  "/legals": "/legals",
  "/conditions": "/conditions",
  "/contact": "/contact",
  "/about": {
    en: "/about",
    fr: "/a-propos",
  },
  "/login": {
    en: "/login",
    fr: "/login",
  },
  "/signup": {
    en: "/signup",
    fr: "/inscription",
  },
  "/forgot-password": {
    en: "/forgot-password",
    fr: "/mot-de-passe-oublie",
  },
  "/reset-password": {
    en: "/reset-password",
    fr: "/reset-password",
  },
  "/profile": {
    en: "/profile",
    fr: "/profil",
  },
  "/profile/settings": {
    en: "/profile/settings",
    fr: "/profil/parametres",
  },
  "/profile/account": {
    en: "/profile/account",
    fr: "/profil/compte",
  },
  "/support": {
    en: "/support",
    fr: "/support",
  },
  "/auth/confirm": {
    en: "/auth/confirm",
    fr: "/auth/confirm",
  },
};

export const dynamicPathNames = {

};

export const allPathnames = { ...staticPathnames, ...dynamicPathNames };

export type AppPathnamesType = keyof typeof allPathnames;

export const localePrefix = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;
