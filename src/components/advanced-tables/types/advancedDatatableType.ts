import type {
  ColumnMeta,
  ColumnSort,
  Row,
  RowData,
} from "@tanstack/react-table";

import type { DataTableConfig } from "@/components/advanced-tables/config/data-table";
import type { FilterItemSchema } from "@/components/advanced-tables/utils/parsers";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    onlyAdvancedFilter?: boolean;
    onlyBasicFilter?: boolean;
  }
}

export interface Option {
  label: string | React.ReactNode;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}

export type TableMetasWithIcons = {
  [key: string]: Omit<ColumnMeta<any, any>, "icon"> & {
    icon: React.ReactNode | string;
  };
};
