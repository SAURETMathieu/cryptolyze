import { getCookie } from "../getCookie";

type Locale = "fr" | "en";

type Translations = {
  [key in Locale]: {
    expired: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

const translations: Translations = {
  fr: {
    expired: "Expiré",
    days: "j",
    hours: "h",
    minutes: "m",
    seconds: "s",
  },
  en: {
    expired: "Expired",
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
  },
};

/**
 * Function to calculate the time remaining until a given timestamp.
 * @param {Date|string|number} targetTimestamp - The target date as a Date object, string, or timestamp.
 * @returns {string} - The remaining time as a string or "expired" if the time has passed.
 */
export function timeRemainingOrExpired(
  targetTimestamp: Date | string | number,
  locale: Locale = "en"
): string {
  const localeToUse = (getCookie("NEXT_LOCALE") as Locale) || locale;
  const t = translations[localeToUse];
  const targetDate = new Date(targetTimestamp);
  const currentDate = new Date();

  const timeDifference = targetDate.getTime() - currentDate.getTime();

  if (timeDifference < 0) {
    return t.expired;
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}${t.days} ${hours}${t.hours}`;
  } else if (hours > 0) {
    return `${hours}${t.hours} ${minutes}${t.minutes}`;
  } else if (minutes > 0) {
    return `${minutes}${t.minutes} ${seconds}${t.seconds}`;
  } else {
    return `${seconds}${t.seconds}`;
  }
}
