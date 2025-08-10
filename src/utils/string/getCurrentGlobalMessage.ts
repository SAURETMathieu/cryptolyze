/**
 * Retrieves the global message for the specified language from a JSON string.
 * If the message cannot be parsed or the language key does not exist, returns `null`.
 *
 * @param {string | null} globalMessage - The global message as a JSON string, or `null`.
 * @param {string} lang - The language code for which the message should be retrieved (e.g., "en", "fr").
 * @returns {string | null} The message in the specified language, or `null` if it can't be found or parsed.
 */

export const getCurrentGlobalMessage = (
  globalMessage: string | null,
  lang: string
) => {
  let globalMessageJson = null;
  if (globalMessage === null) {
    return null;
  }
  try {
    globalMessageJson = globalMessage ? JSON.parse(globalMessage) : null;
  } catch (error) {
    globalMessageJson = null;
  }

  const globalMessageCurrentLang = globalMessageJson
    ? globalMessageJson[lang as keyof typeof globalMessageJson]
    : null;

  return globalMessageCurrentLang as string;
};
