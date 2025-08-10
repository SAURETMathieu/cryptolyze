import "server-only";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m", // Gris
  info: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Jaune
  error: "\x1b[31m", // Rouge
};

const RESET = "\x1b[0m";

const CURRENT_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

function shouldLog(level: LogLevel) {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
}

function formatMessage(level: LogLevel, context: string, message: string) {
  const now = new Date();
  const timestamp = now.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
  const color = COLORS[level];
  return `${color}${timestamp} [${level.toUpperCase()}] (${context}) ${message}${RESET}`;
}

export const logger = {
  debug(context: string, message: string) {
    if (shouldLog("debug"))
      console.debug(formatMessage("debug", context, message));
  },

  info(context: string, message: string) {
    if (shouldLog("info"))
      console.info(formatMessage("info", context, message));
  },

  warn(context: string, message: string) {
    if (shouldLog("warn"))
      console.warn(formatMessage("warn", context, message));
  },

  error(context: string, err: unknown) {
    if (!shouldLog("error")) return;

    const base = formatMessage("error", context, "");

    if (err instanceof Error) {
      console.error(`${base}${COLORS.error}: ${err.message}${RESET}`);
    } else {
      console.error(`${base}${COLORS.error}: ${err}${RESET}`);
    }
  },
};
