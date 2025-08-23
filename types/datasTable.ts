import { ForwardRefExoticComponent, RefAttributes } from "react";
import { buttonVariants } from "@/src/components/ui/button";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ColumnDef, Table, VisibilityState } from "@tanstack/react-table";
import { VariantProps } from "class-variance-authority";
import { LucideProps } from "lucide-react";

type IconComponentType =
  | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  | ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;

export type ColumnConfig = {
  id: string;
  title: string;
  Icon?: IconComponentType;
  options: Array<{
    value: string;
    label: string | React.ReactNode;
    icon?: IconComponentType;
  }>;
};

export type SelectFunction = {
  icon: React.ReactNode; // Icon to display
  text: string; // Button text
  onTrigger: (selectedRows: any[]) => Promise<boolean> | boolean; // Function triggered for selected rows
  condition?: (selectedRows: any[]) => boolean; // Condition to show the button (optional)
  isPending?: boolean; // Button is pending;
  className?: string; // Custom class name
  variant?: VariantProps<typeof buttonVariants>["variant"];
  showText?: boolean; // Show the text of the button
  ariaLabel?: string; // Aria label for the button
};
export type RowLink = {
  rowLink: string;
  customPath: string;
};
export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterTextOptions?: { id: string; placeholder: string };
  columnConfigs?: ColumnConfig[];
  rowLink?: string | RowLink | ((row: any) => any) | undefined;
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  showColumns?: VisibilityState;
  multipleSelectFunctions?: SelectFunction[];
  hideExport?: boolean;
  devEditOneRowFunction?: (row: any) => void;
  devEditAllRowsFunction?: (rows: any[]) => void;
  CardComponent?: React.ComponentType<any>;
  viewMode?: "table" | "card";
  setViewMode?: React.Dispatch<React.SetStateAction<"table" | "card">>;
  refreshFunction?: (params?: Record<string, string>) => Promise<any>;
  synchronizeUrl?: boolean;
  importCsvComponent?: React.ReactNode;
  cellPadding?: string;
  stripedRows?: boolean;
  parentClassName?: string;
  initialSelectedRowIndexes?: Record<string | number, boolean>;
};

export type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  filterTextOptions?: { id: string; placeholder: string };
  columnConfigs?: ColumnConfig[];
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  multipleSelectFunctions?: SelectFunction[];
  hideExport?: boolean;
  showViewMode?: boolean;
  viewMode?: "table" | "card";
  setViewMode?: React.Dispatch<React.SetStateAction<"table" | "card">>;
  refreshFunction?: () => Promise<any>;
  importCsvComponent?: React.ReactNode;
};

export type DataTableToolbarActionsProps = {
  table: Table<any>;
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  multipleSelectFunctions?: SelectFunction[]; // New prop to pass an array of functions
  hideExport?: boolean;
  refreshFunction?: () => Promise<any>;
  importCsvComponent?: React.ReactNode;
};
