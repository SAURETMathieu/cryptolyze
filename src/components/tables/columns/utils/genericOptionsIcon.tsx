import { IconProps } from "@radix-ui/react-icons/dist/types";

interface GenericOptionsIconOption {
  value: string;
  label: string;
}

interface GenericOptionsIconConfig {
  t: MessagesIntl;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  falseValue?: boolean | null;
}

export function createBooleanFilterOptions({
  t,
  Icon,
  falseValue = false,
}: GenericOptionsIconConfig) {
  const options: GenericOptionsIconOption[] = [
    { value: true as any, label: t("yes") },
    { value: falseValue as any, label: t("no") },
  ];

  return {
    options,
    Icon,
  };
}
