import { cn } from "@/src/lib/utils";

import DataTableFiltersSkeleton from "../tables/DataTableFiltersSkeleton";
import DataTablePaginationSkeleton from "../tables/DataTablePaginationSkeleton";

interface DealsSkeletonProps {
  cardCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  showViewMode?: boolean;
  children: (index: number) => React.ReactNode;
  sectionClassName?: string;
}

export function SkeletonListCardTemplate({
  cardCount = 6,
  searchableColumnCount = 1,
  filterableColumnCount = 2,
  showViewOptions = false,
  showViewMode = false,
  children,
  sectionClassName,
}: DealsSkeletonProps) {
  return (
    <>
      <DataTableFiltersSkeleton
        searchableColumnCount={searchableColumnCount}
        filterableColumnCount={filterableColumnCount}
        showViewOptions={showViewOptions}
        showViewMode={showViewMode}
      />
      <DataTablePaginationSkeleton />
      <section
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          sectionClassName
        )}
      >
        {Array.from({ length: cardCount }).map((_, index) => children(index))}
      </section>
    </>
  );
}
