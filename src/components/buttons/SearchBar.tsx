"use client";

import { useSearchParams } from "next/navigation";
import { useURLParams } from "@/src/hooks/useUrlParams";
import { cn } from "@/src/lib/utils";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

export function SearchBar({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) {
  const { updateQueryParams } = useURLParams();
  const searchParams = useSearchParams();
  const debouncedSearch = useDebouncedCallback((search: string) => {
    updateQueryParams("replace", { search, page: 1 });
  }, 300);

  return (
    <div className="flex justify-start lg:justify-center">
      <Input
        className={cn(
          "hover:ring-ring bg-background box-border h-10 w-[calc(100%-135px)] max-w-screen-sm border text-base hover:ring-1 focus:ring-2",
          className
        )}
        placeholder={placeholder ?? "Marque / modèle / SKU, ..."}
        type="search"
        name="search"
        onChange={(e) => debouncedSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
      />
    </div>
  );
}
