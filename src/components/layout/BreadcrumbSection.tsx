"use client";

import React from "react";
import { allPathnames } from "@/src/config";
import { usePathname } from "@/src/i18n/navigation";
import { Home } from "lucide-react";
import { useLocale } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NavigationLink from "../link/NavigationLink";

export default function BreadcrumbSection({
  homePath = "/",
}: {
  homePath?: string;
}) {
  const path = usePathname();
  const locale = useLocale();

  // Split the path into an array of path names
  const currentPathNames: string[] = path.split("/").filter((p) => p);

  // Translate the path names and remove slashes
  const currentPathNamesTranslated = currentPathNames
    ?.map((name: string) => {
      if (allPathnames[("/" + name) as keyof typeof allPathnames]) {
        return (
          //@ts-ignore
          allPathnames[("/" + name) as keyof typeof allPathnames][locale] ??
          name
        );
      }
      return name;
    })
    .map((name) => name.replace(/\//g, ""));

  const maxVisibleItems = 5;
  const invisibleItems =
    currentPathNamesTranslated.length > maxVisibleItems
      ? currentPathNamesTranslated.slice(0, -2)
      : [];

  // Generate the full path up to the given index
  const generateFullPath = (index: number) => {
    if (index >= 0 && index < currentPathNames.length) {
      return "/" + currentPathNames.slice(0, index + 1).join("/");
    }
    return homePath;
  };

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        {/* Render the home icon if there are path names */}
        {currentPathNamesTranslated.length > 0 && (
          <>
            <BreadcrumbItem>
              <NavigationLink href={homePath}>
                <Home className="size-4" />
              </NavigationLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Render the invisible items into the dropdown menu*/}
        {invisibleItems.length > 0 && (
          <>
            <BreadcrumbItem className="capitalize">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {invisibleItems.map((name, index) => {
                    return (
                      <DropdownMenuItem key={index}>
                        <NavigationLink
                          href={generateFullPath(index)}
                          className="w-full capitalize"
                        >
                          {name}
                        </NavigationLink>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Render the rest of visible items */}
        {currentPathNamesTranslated
          .slice(invisibleItems.length)
          .map((name, index) => {
            const actualIndex = invisibleItems.length + index;
            const href = generateFullPath(actualIndex);
            const isLastItem =
              index ===
              currentPathNamesTranslated.slice(invisibleItems.length).length -
                1;

            return (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem className="capitalize">
                  {isLastItem ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <NavigationLink href={href}>{name}</NavigationLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
