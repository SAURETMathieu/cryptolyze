"use client";

import { forwardRef } from "react";
import { AppPathnamesType } from "@/src/config";
import { Link, usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";

type NavigationLinkProps = {
  href: AppPathnamesType;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  preventLink?: boolean;
  [key: string]: any;
};

const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ href, className, onClick, preventLink, ...rest }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href || pathname === href?.pathname;
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (preventLink) {
        event.preventDefault();
      }
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        href={href}
        ref={ref}
        onClick={handleClick}
        className={cn(className)}
        {...rest}
      />
    );
  }
);

NavigationLink.displayName = "NavigationLink";

export default NavigationLink;
