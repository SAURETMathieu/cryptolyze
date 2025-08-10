"use client";

import { useAdminSidebar } from "@/src/hooks/useAdminSideBar";
import { ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { DashboardNav } from "./DashBoardNav";
import { adminNavItems } from "./navbarConfig";

type SidebarProps = {
  className?: string;
};

export default function AdminSidebar({ className }: SidebarProps) {
  const { isMinimized, toggle, toggleFixed, isFixed } = useAdminSidebar();

  const handleToggleFixed = () => {
    toggleFixed();
  };

  const handleMouseEnter = () => {
    if (isMinimized && !isFixed) toggle();
  };

  const handleMouseLeave = () => {
    if (!isMinimized && !isFixed) toggle();
  };

  return (
    <aside
      className={cn(
        `bg-background text-foreground h-main relative hidden flex-none border-r transition-[width] duration-500 md:block`,
        !isMinimized ? "w-[200px]" : "w-[65px]",
        className
      )}
    >
      {/* <div className="hidden px-5 pt-5 lg:block">
        <NavigationLink href={""} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 size-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </NavigationLink>
      </div> */}
      <ChevronsLeft
        className={cn(
          "bg-background text-foreground absolute -right-3 top-1/2 z-50 cursor-pointer rounded-full border text-3xl",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggleFixed}
      />
      <div
        className="space-y-4 py-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="px-3 py-2">
          <div className="space-y-1">
            <DashboardNav items={adminNavItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
