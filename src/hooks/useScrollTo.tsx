"use client";

export function useScrollTo() {
  const handleScroll = (id: string, offset = 0) => {
    const element = document.getElementById(id);
    if (element) {
      if (typeof window !== "undefined") {
        window.scrollTo({
          behavior: "smooth",
          top: element.offsetTop - offset,
        });
      }
    }
  };

  return handleScroll;
}
