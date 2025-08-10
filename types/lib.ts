import { IconProps } from "@radix-ui/react-icons/dist/types";

export type IconType = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown[] | null;
  count?: number;
  status: number;
};

export type FetchResult<T> = Promise<{
  data: T extends any[] ? NonNullable<T> : NonNullable<T> | null;
  count: number;
  success: boolean;
  message: string;
}>;

export type SearchParamsType = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type DistinctType = {
  value: string;
  count: number;
};

export type FetchDistinctsResult = Promise<DistinctType[]>;

export type AdvancedFilterOptionType = {
  value: string;
  label: string | React.ReactElement;
  count: number;
};
