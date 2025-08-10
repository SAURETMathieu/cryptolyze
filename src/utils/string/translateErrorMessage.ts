import dictionnaryEN from "@/src/lib/supabase/errors/en.json";
import dictionnaryFR from "@/src/lib/supabase/errors/fr.json";

import { getCookie } from "../getCookie";

type Dictionary = Record<string, string>;

/**
 * Translate an error message by replacing keys with their translations.
 *
 * @param {any} error - The error object containing the message to be translated.
 * @param {string} defaultMessage - The fallback message in case translation is not available.
 * @returns {string} The translated error message or the default message if translation is not found.
 */
export function translateErrorMessage(error: any, defaultMessage: string) {
  const message = error?.message as string;
  const locale = getCookie("NEXT_LOCALE") || "fr";
  const dictionary: Dictionary =
    locale === "en" ? dictionnaryEN : dictionnaryFR;
  const regex = /(\w+_\w+)/g;
  const matches = message.match(regex);

  if (!matches) {
    return defaultMessage;
  }

  const allKeysExist = matches.every((word) => word in dictionary);

  if (allKeysExist) {
    const translations = matches.map((word) => dictionary[word]);

    let translatedMessage = message;
    matches.forEach((word, index) => {
      translatedMessage = translatedMessage.replace(word, translations[index]);
    });

    return translatedMessage;
  }

  return defaultMessage;
}

/**
 * Translate a generic message by replacing keys with their translations.
 *
 * @param {string} message - The message to translate.
 * @param {string} defaultMessage - The fallback message in case translation is not available.
 * @returns {string} The translated message or the default message if translation is not found.
 */
export function translateMessage(message: string, defaultMessage: string) {
  const locale = getCookie("NEXT_LOCALE") || "fr";
  const dictionary: Dictionary =
    locale === "en" ? dictionnaryEN : dictionnaryFR;
  const regex = /(\w+_\w+)/g;
  const matches = message.match(regex);

  if (!matches) {
    return defaultMessage;
  }

  const allKeysExist = matches.every((word) => word in dictionary);

  if (allKeysExist) {
    const translations = matches.map((word) => dictionary[word]);

    let translatedMessage = message;
    matches.forEach((word, index) => {
      translatedMessage = translatedMessage.replace(word, translations[index]);
    });

    return translatedMessage;
  }

  return defaultMessage;
}
