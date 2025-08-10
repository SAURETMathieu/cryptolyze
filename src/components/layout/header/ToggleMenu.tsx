"use client";

import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import NavigationLink from "@/src/components/link/NavigationLink";
import { Icons } from "@/src/components/icons/icons";
import { PanelLeft } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { MainNavProps } from "@/types/nav";

export default function ToggleMenu({ items }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 pt-6 text-lg font-medium">
          <NavigationLink
            href="/"
            className="is-logo flex items-center justify-center"
            onClick={handleLinkClick}
          >
            <Icons.logo className="size-20" />
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </NavigationLink>
          {items?.map(
            (item, index) =>
              item.href && (
                <NavigationLink
                  key={index}
                  href={item.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {item.title}
                </NavigationLink>
              )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
