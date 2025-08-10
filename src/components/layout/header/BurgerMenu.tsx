"use client";

import { Fragment, useState } from "react";
import { useAuth } from "@/src/context/userProvider";
import { Menu, Package, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/icons/icons";
import NavigationLink from "@/components/link/NavigationLink";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const tNav = useTranslations("Navbar");
  const { profile } = useAuth();

  return (
    <div className="relative md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="dark:hover:bg-primary/20"
            aria-label={isOpen ? tNav("ariaClose") : tNav("ariaOpen")}
            onClick={toggleMenu}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] pt-4"
          aria-describedby={tNav("ariaBurgerContent")}
        >
          <SheetTitle className="hidden">Limited hub</SheetTitle>
          <SheetDescription className="hidden">
            {tNav("ariaBurgerContent")}
          </SheetDescription>
          <Icons.limited className="h-[50px] w-[250px]" />
          <div className="mt-8 flex flex-col space-y-4 pr-8 text-2xl">
            {siteConfig?.mainNav.map((component) => (
              <Fragment key={component.title}>
                {((component.shouldAuth && profile) ||
                  !component.shouldAuth) && (
                  <NavigationLink
                    key={component.title + "link"}
                    href={component.href}
                    className="hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="mx-2 flex items-center gap-2 text-2xl capitalize">
                      <span>{component.icon}</span>
                      <span>{tNav(component.title as keyof MessagesIntl)}</span>
                    </div>
                  </NavigationLink>
                )}
                {component.title === "deals" && profile && (
                  <NavigationLink
                    key={"shippings"}
                    href={"/shippings"}
                    className="hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="mx-2 flex items-center gap-2 text-2xl capitalize">
                      <span>
                        <Package className="size-5" />
                      </span>
                      <span>{tNav("shippings")}</span>
                    </div>
                  </NavigationLink>
                )}
              </Fragment>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
