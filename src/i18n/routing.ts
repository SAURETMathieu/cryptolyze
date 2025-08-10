import { defineRouting } from "next-intl/routing";

import { allPathnames, defaultLocale, localePrefix, locales } from "../config";

export const routing = defineRouting({
  locales,
  localePrefix,
  defaultLocale,
  pathnames: allPathnames,
});
