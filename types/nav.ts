import { AppPathnamesType } from "@/src/config";

export type NavItem = {
  title: string;
  href?: AppPathnamesType;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  shouldAuth?: boolean;
};

export type MainNavProps = {
  items?: NavItem[];
};
