"use client";

import { useEffect, useRef } from "react";
import GlobalAlert from "@/src/components/alerts/GlobalAlert";
import LoadingTopBarBeam from "@/src/components/link/NavigationProgress";
import { useAuth } from "@/src/context/userProvider";

import { siteConfig } from "@/config/site";

import BreadcrumbSection from "../BreadcrumbSection";
import AsideMenu from "./Aside";
import { RightNav } from "./RightNav";
import ToggleMenu from "./ToggleMenu";

export function Header() {
  const { setHeaderHeight, loadingApp } = useAuth();
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) return;

    const updateHeight = () => {
      setHeaderHeight(headerElement.offsetHeight);
    };

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(headerElement);

    updateHeight();

    return () => {
      observer.disconnect();
    };
  }, [setHeaderHeight]);

  return (
    <>
      <header
        ref={headerRef}
        className="bg-card border sticky top-0 z-40 w-full border-b"
      >
        <LoadingTopBarBeam
          isLoading={loadingApp}
          color="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
        <div className="flex gap-6 md:gap-10">
          {siteConfig.mainNav?.length ? (
            <>
              <AsideMenu
                itemsTop={siteConfig.mainNav}
                itemsBottom={siteConfig.secondaryNav}
              />
              <div className="flex w-full flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <section className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <ToggleMenu items={siteConfig.mainNav} />
                  <BreadcrumbSection />
                  <RightNav />
                </section>
              </div>
            </>
          ) : null}
        </div>
        <GlobalAlert />
      </header>
    </>
  );
}
