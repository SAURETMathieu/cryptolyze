import { useEffect, useState } from "react";

export const usePreventPopStateOnOpen = (initialIsOpen: boolean) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ dummy: true }, "", "");

      const handlePopState = (event: PopStateEvent) => {
        if (isOpen) {
          setIsOpen(false);
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen]);

  return { isOpen, setIsOpen };
};
