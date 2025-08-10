import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as any)
    ? requested
    : routing.defaultLocale;

  const messages = {
    ...(await import(`../../messages/${locale}/auth.json`)).default,
    ...(await import(`../../messages/${locale}/footer.json`)).default,
    ...(await import(`../../messages/${locale}/forms.json`)).default,
    ...(await import(`../../messages/${locale}/nav.json`)).default,
    ...(await import(`../../messages/${locale}/table.json`)).default,
    ...(await import(`../../messages/${locale}/title.json`)).default,
  };

  return {
    messages,
    locale: locale || routing.defaultLocale,
  };
});
