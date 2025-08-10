"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/userProvider";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons/icons";
import NavigationLink from "@/components/link/NavigationLink";

export default function BackOfficeLink() {
  const { profile } = useAuth();
  const [isVisisble, setIsVisible] = useState(false);

  useEffect(() => {
    profile?.role === "Team" ? setIsVisible(true) : setIsVisible(false);
  }, [profile]);

  if (!isVisisble) return null;

  return (
    <NavigationLink href="/admin" className="" aria-label="Back Office Link">
      <Button
        className="dark:hover:bg-primary/20 mx-0"
        size="icon"
        variant="ghost"
      >
        <Icons.ld
          className="size-6 cursor-pointer"
          aria-label="Back Office Link Logo"
        />
      </Button>
    </NavigationLink>
  );
}
