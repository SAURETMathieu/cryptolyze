import {
  Bitcoin,
  Bot,
  CandlestickChart,
  Home,
  Info,
  Settings,
  Wallet,
} from "lucide-react";

import { NavItem } from "@/types/nav";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "",
  description:
    "Application to manage cryptos wallets and transactions. Built with Next.js, TypeScript, Tailwind CSS, and more.",
  mainNav: [
    {
      title: "Home",
      href: "/",
      icon: <Home className="size-5" />,
    },
    {
      title: "Wallets",
      href: "/wallets",
      icon: <Wallet className="size-5" />,
    },
    {
      title: "Bots",
      href: "/bots",
      icon: <Bot className="size-5" />,
    },
    {
      title: "Cryptos",
      href: "/cryptos",
      icon: <Bitcoin className="size-5" />,
    },
    {
      title: "Charts",
      href: "/charts",
      icon: <CandlestickChart className="size-5" />,
    },
  ] as NavItem[],
  secondaryNav: [
    {
      title: "Help",
      href: "/help",
      icon: <Info className="size-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="size-5" />,
    },
  ] as NavItem[],
  links: {
    github: "https://github.com/SAURETMathieu",
  },
};
