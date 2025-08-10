import { MetadataRoute } from "next";
import {
  defaultLocale,
  dynamicPathNames,
  host,
  locales,
  staticPathnames,
} from "@/src/config";
import { getPathname } from "@/src/i18n/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(staticPathnames) as Array<
    keyof typeof staticPathnames
  >;
  const dynamicsKeys = Object.keys(dynamicPathNames) as Array<
    keyof typeof dynamicPathNames
  >;
  function getUrl(
    key: keyof typeof staticPathnames,
    locale: (typeof locales)[number]
  ) {
    const pathname = getPathname({ locale, href: key });
    return `${host}${pathname === "/" ? "" : pathname}`;
  }

  //TODO test with database
  // const keyToFetch = dynamicsKeys.map((key) => {
  //   if (key.includes("[")) {
  //     const matches = key.match(/\[([^\]]+)\]/g);

  //     const extracted = matches?.map(match => match.slice(1, -1));

  //     return {
  //       params:extracted,
  //       url: key
  //     };
  //   }
  // });

  // console.log("tofetch",keyToFetch);

  const sitemap = keys.map((key) => {
    if (key.includes("[")) {
      // Use regex to find all matches within square brackets
      const matches = key.match(/\[([^\]]+)\]/g);

      // Extract just the content inside the brackets
      const extracted = matches?.map((match) => match.slice(1, -1));
    }
    return {
      url: getUrl(key, defaultLocale),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, getUrl(key, locale)])
        ),
      },
    };
  });
  return sitemap;
}
