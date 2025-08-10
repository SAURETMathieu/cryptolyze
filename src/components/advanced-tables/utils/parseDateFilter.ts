import { ExtendedColumnFilter } from "../types/advancedDatatableType";

export function parseDateFilter(filter: ExtendedColumnFilter<any>) {
  if (filter.variant === "date" && filter.value) {
    let value = filter.value;
    if (filter.operator === "isBetween") {
      if (Array.isArray(value)) {
        value = [
          new Date(Number(value[0])).toISOString(),
          new Date(
            Number(value[1] ?? Number(value[0]) + 1000 * 60 * 60 * 24)
          ).toISOString(),
        ];
      } else {
        const date = new Date(Number(value)).toISOString();
        const date2 = new Date(
          Number(value) + 1000 * 60 * 60 * 24
        ).toISOString();
        value = [date, date2];
      }
    } else {
      if (Array.isArray(value)) {
        value = [new Date(Number(value[0])).toISOString()];
      } else {
        value = new Date(Number(value)).toISOString();
      }
    }
    return value;
  }
  return filter.value;
}
