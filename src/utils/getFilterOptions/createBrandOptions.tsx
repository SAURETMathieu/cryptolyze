import { IconProps } from "@radix-ui/react-icons/dist/types";
import { CountryCode } from "libphonenumber-js";
import flags from "react-phone-number-input/flags";

import { BrandLogos } from "@/components/icons/brandLogos";

type Option = {
  value: string;
  label: string | React.ReactElement<any>;
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  count: number;
};

export function createBrandOptions<T>(
  items: T[],
  extractor: (item: T) => string | null | undefined,
  countExtractor: (item: T) => number = () => 1
): Option[] {
  const createOption = (value: string, count: number): Option => {
    const formattedLabel = value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "Unknown";

    const icon =
      value && value in BrandLogos
        ? (BrandLogos[
            value as keyof typeof BrandLogos
          ] as React.ForwardRefExoticComponent<
            IconProps & React.RefAttributes<SVGSVGElement>
          >)
        : value && flags[value as CountryCode]
          ? (flags[
              value as CountryCode
            ] as unknown as React.ForwardRefExoticComponent<
              IconProps & React.RefAttributes<SVGSVGElement>
            >)
          : undefined;

    return {
      value: value || "",
      label: formattedLabel,
      icon: icon,
      count: count,
    };
  };

  const sortOptions = (options: Option[]) => {
    return options.sort((a, b) => {
      const labelA = typeof a.label === "string" ? a.label : "";
      const labelB = typeof b.label === "string" ? b.label : "";
      return labelA.localeCompare(labelB);
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
