import { IconProps } from "@radix-ui/react-icons/dist/types";
import { CountryCode } from "libphonenumber-js";
import flags from "react-phone-number-input/flags";

type Option = {
  value: string;
  label: string | React.ReactElement<any>;
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  count: number;
};

export function createCountryOptions<T>(
  items: T[],
  extractor: (item: T) => string | null | undefined,
  isLanguage: boolean = false,
  countExtractor: (item: T) => number = () => 1
): Option[] {
  const languageMap = {
    EN: "GB",
    CS: "CZ",
    SV: "SE",
  } as const;

  const createOption = (value: string, count: number = 1): Option => {
    const formattedLabel = value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "Unknown";

    const icon = flags[
      isLanguage
        ? languageMap[value as keyof typeof languageMap] || value
        : (value as CountryCode)
    ] as unknown as React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >;

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

  if (countExtractor) {
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

  return sortOptions(
    items
      .map(extractor)
      .filter(
        (value, index, self) =>
          value !== null && value !== undefined && self.indexOf(value) === index
      )
      .map((value) => createOption(value || ""))
  );
}
