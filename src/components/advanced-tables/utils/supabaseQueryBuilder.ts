import {
  ExtendedColumnFilter,
  ExtendedColumnSort,
  TableMetasWithIcons,
} from "../types/advancedDatatableType";
import { parseDateForQuery } from "./parseDateForQuery";

export function applyFiltersWithAndOperator<TData>(
  query: any,
  filters: ExtendedColumnFilter<TData>[],
  columnsMapping: Record<string, string | string[]>
) {
  if (!filters.length) return query;

  const validFiltersWithMapping = filters.map((filter) => {
    const mappedColumn =
      columnsMapping[filter.id as keyof typeof columnsMapping];
    let mappedId = filter.id as string;

    if (mappedColumn) {
      if (Array.isArray(mappedColumn)) {
        // Si c'est un tableau, prendre le premier élément
        mappedId = mappedColumn[0];
      } else {
        mappedId = mappedColumn;
      }
    }

    return {
      ...filter,
      id: mappedId,
    };
  });

  for (const filter of validFiltersWithMapping) {
    const column = filter.id;
    const value = filter.value;
    const isDateVariant =
      filter.variant === "date" || filter.variant === "dateRange";
    switch (filter.operator) {
      case "eq":
        if (isDateVariant) {
          const { start, end } = parseDateForQuery(value, "eq");
          query = query.gte(column, start).lt(column, end);
        } else {
          query = query.eq(column, value);
        }
        break;
      case "ne":
        if (isDateVariant) {
          const { start, end } = parseDateForQuery(value, "ne");
          query = query.or(
            [`${column}.lt.${start}`, `${column}.gte.${end}`].join(",")
          );
        } else {
          query = query.neq(column, value);
        }
        break;
      case "gt":
        if (isDateVariant) {
          const { end } = parseDateForQuery(value, "gt");
          query = query.gte(column, end);
        } else {
          query = query.gt(column, value);
        }
        break;
      case "gte":
        if (isDateVariant) {
          const { start } = parseDateForQuery(value, "gte");
          query = query.gte(column, start);
        } else {
          query = query.gte(column, value);
        }
        break;
      case "lt":
        if (isDateVariant) {
          const { start } = parseDateForQuery(value, "lt");
          query = query.lt(column, start);
        } else {
          query = query.lt(column, value);
        }
        break;
      case "lte":
        if (isDateVariant) {
          const { end } = parseDateForQuery(value, "lte");
          query = query.lte(column, end);
        } else {
          query = query.lte(column, value);
        }
        break;
      case "isBetween":
        if (isDateVariant) {
          const { start, end } = parseDateForQuery(value, "isBetween");
          query = query.gte(column, start).lt(column, end);
        } else {
          query = query.gte(column, value[0]).lte(column, value[1] ?? value[0]);
        }
        break;
      case "isEmpty":
        query = query.is(column, null);
        break;
      case "isNotEmpty":
        query = query.not(column, "is", null);
        break;
      case "iLike":
        query = query.ilike(column, `%${value}%`);
        break;
      case "notILike":
        query = query.not(column, "ilike", `%${value}%`);
        break;
      case "inArray":
        query = query.in(column, Array.isArray(value) ? value : [value]);
        break;
      case "notInArray":
        if (Array.isArray(value) && value.length > 0) {
          const values = value.map((v) => `"${v}"`).join(",");
          query = query.filter(column, "not.in", `(${values})`);
        }
        break;
      default:
        break;
    }
  }

  return query;
}

export function applyFiltersWithOrOperator<TData>(
  query: any,
  filters: ExtendedColumnFilter<TData>[],
  columnsMapping: Record<string, string | string[]>
) {
  if (!filters.length) return query;

  const validFiltersWithMapping = filters.map((filter) => {
    const mappedColumn =
      columnsMapping[filter.id as keyof typeof columnsMapping];
    let mappedId = filter.id as string;

    if (mappedColumn) {
      if (Array.isArray(mappedColumn)) {
        // Si c'est un tableau, prendre le premier élément
        mappedId = mappedColumn[0];
      } else {
        mappedId = mappedColumn;
      }
    }

    return {
      ...filter,
      id: mappedId,
    };
  });

  const conditions = validFiltersWithMapping
    .map((filter) => {
      switch (filter.operator) {
        case "eq":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { start, end } = parseDateForQuery(filter.value, "eq");
            return `and(${filter.id}.gte.${start},${filter.id}.lt.${end})`;
          } else {
            return `${filter.id}.eq.${filter.value}`;
          }
        case "ne":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { start, end } = parseDateForQuery(filter.value, "ne");
            return `or(${filter.id}.gte.${start},${filter.id}.lt.${end})`;
          } else {
            return `${filter.id}.neq.${filter.value}`;
          }
        case "gt":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { end } = parseDateForQuery(filter.value, "gt");
            return `${filter.id}.gte.${end}`;
          } else {
            return `${filter.id}.gt.${filter.value}`;
          }
        case "gte":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { start } = parseDateForQuery(filter.value, "gte");
            return `${filter.id}.gte.${start}`;
          } else {
            return `${filter.id}.gte.${filter.value}`;
          }
        case "lt":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { start } = parseDateForQuery(filter.value, "lt");
            return `${filter.id}.lt.${start}`;
          } else {
            return `${filter.id}.lt.${filter.value}`;
          }
        case "lte":
          if (filter.variant === "date" || filter.variant === "dateRange") {
            const { end } = parseDateForQuery(filter.value, "lte");
            return `${filter.id}.lte.${end}`;
          } else {
            return `${filter.id}.lte.${filter.value}`;
          }
        case "isBetween":
          if (filter.variant === "dateRange" || filter.variant === "date") {
            const { start, end } = parseDateForQuery(filter.value, "isBetween");
            return `and(${filter.id}.gte.${start},${filter.id}.lt.${end})`;
          } else {
            return `and(${filter.id}.gte.${filter.value[0]},${filter.id}.lte.${filter.value[1] ?? filter.value[0]})`;
          }
        case "isEmpty":
          return `${filter.id}.is.null`;
        case "isNotEmpty":
          return `${filter.id}.not.is.null`;
        case "iLike":
          return `${filter.id}.ilike.%${filter.value}%`;
        case "notILike":
          return `${filter.id}.not.ilike.%${filter.value}%`;
        case "inArray":
          return `${filter.id}.in.(${Array.isArray(filter.value) ? filter.value.join(",") : filter.value})`;
        case "notInArray":
          return `${filter.id}.not.in.(${Array.isArray(filter.value) ? filter.value.join(",") : filter.value})`;
        default:
          return null;
      }
    })
    .filter(Boolean);

  if (conditions.length > 0) {
    query = query.or(conditions.join(","));
  }

  return query;
}

export function applySorting<TData>(
  query: any,
  sorts: ExtendedColumnSort<TData>[] | string,
  columnsMapping: Record<string, string | string[]>
) {
  if (!sorts) return query;
  let parsedSorts: ExtendedColumnSort<TData>[];

  try {
    parsedSorts = typeof sorts === "string" ? JSON.parse(sorts) : sorts;
  } catch (e) {
    console.error("Failed to parse sorts", e);
    return query;
  }

  return parsedSorts.reduce((q, sort) => {
    const mappedColumn = columnsMapping[sort.id as keyof typeof columnsMapping];
    let column = sort.id as string;

    // Gérer le mapping des colonnes
    if (mappedColumn) {
      if (Array.isArray(mappedColumn)) {
        // Si c'est un tableau, prendre le premier élément
        column = mappedColumn[0];
      } else {
        column = mappedColumn;
      }
    }

    return q.order(column, { ascending: !sort.desc });
  }, query);
}

export function buildSupabaseAdvancedQuery<TData>(
  baseQuery: any,
  {
    filters = [],
    sorts = [],
    offset = 0,
    perPage = 50,
    joinOperator = "and",
    columnsMapping = {},
  }: {
    filters?: ExtendedColumnFilter<TData>[];
    sorts?: ExtendedColumnSort<TData>[] | string;
    offset?: number;
    perPage?: number;
    joinOperator?: "and" | "or";
    columnsMapping?: Record<string, string | string[]>;
  }
) {
  let query = baseQuery;

  // Apply filters
  if (filters && filters.length > 0) {
    query =
      joinOperator === "or"
        ? applyFiltersWithOrOperator(query, filters, columnsMapping)
        : applyFiltersWithAndOperator(query, filters, columnsMapping);
  }

  // Apply sorting
  if (sorts && sorts.length > 0) {
    query = applySorting(query, sorts, columnsMapping);
  }

  // Apply pagination
  query = query.range(offset, offset + perPage - 1);

  return query;
}

export function buildSupabaseBasicQuery<TData>(
  baseQuery: any,
  {
    filters = [],
    sorts = [],
    offset = 0,
    perPage = 50,
    columnsMapping = {},
    metas = {},
    sortingMapping = {},
  }: {
    filters?: { id: string; value: unknown }[];
    sorts?: ExtendedColumnSort<TData>[] | string;
    offset?: number;
    perPage?: number;
    columnsMapping?: Record<string, string | string[]>;
    sortingMapping: Record<string, string | string[]>;
    metas?: TableMetasWithIcons;
  }
) {
  let query = baseQuery;

  // Apply filters
  const validFiltersWithMapping = filters.map((filter) => {
    return {
      ...filter,
      id: columnsMapping[filter.id as keyof typeof columnsMapping] || filter.id,
      variant: metas[filter.id as keyof typeof metas]?.variant,
    };
  });
  if (validFiltersWithMapping && validFiltersWithMapping.length > 0) {
    validFiltersWithMapping.forEach((filter) => {
      switch (filter.variant) {
        case "multiSelect":
          query = query.in(
            filter.id,
            Array.isArray(filter.value) ? filter.value : [filter.value]
          );
          break;
        case "text":
          if (Array.isArray(filter.id)) {
            const orConditions = filter.id.map(
              (id) => `${id}.ilike.%${filter.value}%`
            );
            query = query.or(orConditions.join(","));
          } else {
            query = query.ilike(filter.id, `%${filter.value}%`);
          }
          break;
        case "date":
          const { start: startDate, end: endDate } = parseDateForQuery(
            filter.value,
            "eq"
          );
          query = query.gte(filter.id, startDate).lt(filter.id, endDate);
          break;
        case "dateRange":
          const { start, end } = parseDateForQuery(filter.value, "isBetween");
          query = query.gte(filter.id, start).lt(filter.id, end);
          break;
        case "uuid":
          query = query.eq(filter.id, filter.value);
          break;
        default:
          query = query.eq(filter.id, filter.value);
          break;
      }
    });
  }

  // Apply sorting
  if (sorts && sorts.length > 0) {
    query = applySorting(query, sorts, sortingMapping);
  }

  // Apply pagination
  query = query.range(offset, offset + perPage - 1);

  return query;
}
