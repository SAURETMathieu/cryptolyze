import "server-only";

import { cookies } from "next/headers";
import type { NamespaceKeys } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function getDictionnary(
  namespace: NamespaceKeys<IntlMessages, keyof IntlMessages> = "Forms"
) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "fr";

  const t = await getTranslations({
    locale,
    namespace,
  });

  return t;
}
