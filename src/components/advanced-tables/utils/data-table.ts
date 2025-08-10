import { dataTableConfig } from "@/components/advanced-tables/config/data-table";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/components/advanced-tables/types/advancedDatatableType";

import { parseDateFilter } from "./parseDateFilter";

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator; operator: string }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
    uuid: dataTableConfig.uuidOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters
    .filter(
      (filter) =>
        filter.operator === "isEmpty" ||
        filter.operator === "isNotEmpty" ||
        (Array.isArray(filter.value)
          ? filter.value.length > 0
          : filter.value !== "" &&
            filter.value !== null &&
            filter.value !== undefined)
    )
    .map((filter) => {
      return {
        ...filter,
        value: parseDateFilter(filter),
      };
    });
}

type FiltersInput = Record<string, unknown>;

export function getValidBasicFiltersFromObject(
  input: FiltersInput
): { id: string; value: unknown }[] {
  return Object.entries(input)
    .map(([id, value]) => ({ id, value }))
    .filter(({ value }) => {
      if (value === null || value === undefined) return false;

      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed !== "" && trimmed !== "null" && trimmed !== "[]";
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return true;
    });
}
