import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type Option = {
  value: string;
  label: string | React.ReactElement;
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  count: number;
};

export function createUniqueOptions<T>(
  items: T[],
  extractor: (item: T) => string | null | undefined,
  formatter: (
    value: string | null | undefined
  ) => string | React.ReactElement = (value) => value || "Unknown",
  iconGenerator?: (
    value: string
  ) =>
    | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
    | undefined,
  sortOrder: "asc" | "desc" | null = "asc",
  countExtractor: (item: T) => number = () => 1
): Option[] {
  const createOption = (value: string, count: number): Option => ({
    value: value || "",
    label: formatter(value),
    icon: value && iconGenerator ? iconGenerator(value) : undefined,
    count: count,
  });

  const sortOptions = (options: Option[]) => {
    if (!sortOrder) return options;

    return options.sort((a, b) => {
      const labelA = typeof a.label === "string" ? a.label : "";
      const labelB = typeof b.label === "string" ? b.label : "";
      return (
        labelA.localeCompare(labelB, undefined, { numeric: true }) *
        (sortOrder === "asc" ? 1 : -1)
      );
    });
  };

  const countMap = new Map<string, number>();

  items.forEach((item) => {
    const value = extractor(item);
    if (value !== null && value !== undefined) {
      countMap.set(value, (countMap.get(value) || 0) + countExtractor(item));
    }
  });

  return sortOptions(
    Array.from(countMap.entries()).map(([value, count]) =>
      createOption(value, count)
    )
  );
}
