import { createHiddenColumn } from "../hidden.column";

interface HiddenColumnProps {
  id: string;
  accessorKey?: string;
  title?: string;
  meta?: any;
}

export function createHiddenColumnsFunction(columns: HiddenColumnProps[]) {
  return columns.map(({ id, accessorKey, title }) =>
    createHiddenColumn({
      id,
      accessorKey: accessorKey ?? id,
      title: title ?? id,
    })
  );
}

export function createHiddenColumnsFunctionAdvancedFilter(
  columns: HiddenColumnProps[]
) {
  return columns.map(({ id, accessorKey, title, meta }) => ({
    ...createHiddenColumn({
      id,
      accessorKey: accessorKey ?? id,
      title: title ?? id,
    }),
    enableColumnFilter: meta ? true : false,
    meta,
  }));
}
