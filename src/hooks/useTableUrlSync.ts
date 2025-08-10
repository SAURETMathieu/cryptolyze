import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useURLParams } from "@/src/hooks";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Table } from "@tanstack/react-table";

export function useTableUrlSync<TData>(
  table: Table<TData>,
  synchronizeUrl: boolean = true,
  filterTextId: string = "search",
  onParamsChange?: (params?: Record<string, string>) => Promise<any>,
  debounceTime: number = 300
) {
  const searchParams = useSearchParams();
  const { updateQueryParams } = useURLParams();
  const hasInitializedFromURL = useRef(false);
  const isUpdatingFromURL = useRef(false);

  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const columnFilters = table.getState().columnFilters;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // Debounce des paramètres pour le fetch
  const debouncedParams = useDebounce(
    useMemo(() => {
      const params: Record<string, string> = {};

      // Gestion des filtres
      table.getAllColumns().forEach((column) => {
        const filterValue = column.getFilterValue() as string | undefined;
        if (filterValue && filterValue.length > 0) {
          params[column.id] = filterValue;
        }
      });

      // Gestion de la pagination
      // const currentPage = pageIndex + 1;
      // if (currentPage !== 1) {
      //   params["page"] = currentPage;
      // }

      if (pageSize !== 10) {
        params["pageSize"] = pageSize.toString();
      }

      return params;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters, pageSize]),
    debounceTime
  );

  // Initialize table from URL
  useEffect(() => {
    if (!synchronizeUrl || hasInitializedFromURL.current) return;

    isUpdatingFromURL.current = true;

    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "pageSize") {
        filters[key] = value.split(",");
      }
    });

    table.getAllColumns().forEach((column) => {
      const filterValue = filters[column.id];
      if (filterValue) {
        if (column.id === filterTextId) {
          column.setFilterValue(filterValue.join(","));
        } else {
          column.setFilterValue(filterValue);
        }
      }
    });

    // const page = searchParams.get("page");
    // if (page) {
    //   table.setPageIndex(parseInt(page) - 1);
    // }

    const pageSize = searchParams.get("pageSize");
    if (pageSize) {
      table.setPageSize(parseInt(pageSize));
    }

    hasInitializedFromURL.current = true;
    isUpdatingFromURL.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synchronizeUrl, searchParamsString]);

  // Synchronize table to URL
  useEffect(() => {
    if (
      !synchronizeUrl ||
      !hasInitializedFromURL.current ||
      isUpdatingFromURL.current
    )
      return;

    const keysToSet: Record<string, string | number> = {};
    const keysToRemove: string[] = [];

    // Gestion des filtres
    table.getAllColumns().forEach((column) => {
      const filterValue = column.getFilterValue() as string | undefined;
      if (filterValue && filterValue.length > 0) {
        keysToSet[column.id] = filterValue;
      } else {
        keysToRemove.push(column.id);
      }
    });

    // Gestion de la pagination
    // const currentPage = pageIndex + 1;
    // if (currentPage !== 1) {
    //   keysToSet["page"] = currentPage;
    // } else {
    //   keysToRemove.push("page");
    // }

    if (pageSize !== 10) {
      keysToSet["pageSize"] = pageSize;
    } else {
      keysToRemove.push("pageSize");
    }

    updateQueryParams("replace", keysToSet, keysToRemove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, pageSize, synchronizeUrl]);

  // Fetch des données avec debounce
  useEffect(() => {
    if (
      !synchronizeUrl ||
      !hasInitializedFromURL.current ||
      isUpdatingFromURL.current
    )
      return;
    if (onParamsChange) {
      onParamsChange(debouncedParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParams]);
}
