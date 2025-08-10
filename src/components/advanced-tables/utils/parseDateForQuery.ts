import { formatDateToPg } from "@/src/utils";

export function parseDateForQuery(
  value: unknown,
  operator: "gte" | "lte" | "gt" | "lt" | "eq" | "ne" | "isBetween"
): { start: string; end: string } {
  const rawStart = Array.isArray(value) ? value[0] : value;
  const start = new Date(Number(rawStart));

  // if the end is 0 or "0", use the start date
  const rawEnd = Array.isArray(value)
    ? value[1] !== 0 && value[1] !== "0"
      ? value[1] || value[0]
      : value[0]
    : value;
  const end =
    operator === "isBetween"
      ? new Date(Number(rawEnd))
      : new Date(Number(rawStart));
  if (
    operator !== "isBetween" ||
    (Array.isArray(value) && (value[1] === 0 || value[1] === "0"))
  ) {
    end.setDate(start.getDate() + 1);
  }
  return { start: formatDateToPg(start), end: formatDateToPg(end) };
}
