import { Database, Home, Lock, LockOpen, Mail, Users2 } from "lucide-react";

export interface AdminNavSubItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface AdminNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
  subItems?: AdminNavSubItem[];
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Tableau de bord",
    href: "/admin",
    icon: <Home className={`size-4 flex-none lg:size-5`} />,
    label: "Tableau de bord",
  },
  {
    title: "Administration",
    icon: <Lock className={`size-4 flex-none lg:size-5`} />,
    label: "Administration",
    subItems: [
      {
        title: "Emails",
        href: "/admin/administration/emails",
        icon: <Mail className={`size-4 flex-none lg:size-5`} />,
        label: "Emails",
      },
      {
        title: "Permissions",
        href: "/admin/administration/permissions",
        icon: <LockOpen className={`size-4 flex-none lg:size-5`} />,
        label: "Permissions",
      },
      {
        title: "Teams",
        href: "/admin/administration/teams",
        icon: <Users2 className={`size-4 flex-none lg:size-5`} />,
        label: "Teams",
      },
      {
        title: "Triggers",
        href: "/admin/administration/triggers",
        icon: <Database className={`size-4 flex-none lg:size-5`} />,
        label: "Triggers",
      },
    ],
  },
];
