import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge, BadgeVariantType } from "@/src/components/ui/badge";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type Option = {
  value: string;
  label: React.ReactElement;
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  count: number;
};

export function createBadgeOptions<T>(
  items: T[],
  extractor: (item: T) => string | null | undefined,
  tTable: any,
  getBadgeColorFunction: (value: string) => BadgeVariantType,
  iconGenerator?: (
    value: string
  ) =>
    | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
    | undefined,
  countExtractor: (item: T) => number = () => 1,
  getLabelFunction?: (value: string) => string
): Option[] {
  const createOption = (value: string, count: number): Option => ({
    value: value || "",
    label: value ? (
      <Badge
        variant={getBadgeColorFunction(value)}
        className="text-md mx-auto flex w-fit rounded-lg px-1 capitalize"
      >
        {getLabelFunction ? getLabelFunction(value) : tTable(value as any)}
      </Badge>
    ) : (
      <span>---</span>
    ),
    icon: value && iconGenerator ? iconGenerator(value) : undefined,
    count: count,
  });

  const countMap = new Map<string, number>();

  items.forEach((item) => {
    const value = extractor(item);
    if (value !== null && value !== undefined) {
      countMap.set(value, (countMap.get(value) || 0) + countExtractor(item));
    }
  });

  return Array.from(countMap.entries())
    .map(([value, count]) => createOption(value, count))
    .sort((a, b) => a.value.localeCompare(b.value));
}
