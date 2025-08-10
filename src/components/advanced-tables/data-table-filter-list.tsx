"use client";

import * as React from "react";
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/src/components/ui/faceted";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/src/components/ui/sortable";
import { formatDate } from "@/src/utils";
import type { Column, ColumnMeta, Table } from "@tanstack/react-table";
import { Locale } from "date-fns";
import { enGB as en, fr } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";
import { dataTableConfig } from "@/components/advanced-tables/config/data-table";
import { DataTableRangeFilter } from "@/components/advanced-tables/data-table-range-filter";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from "@/components/advanced-tables/types/advancedDatatableType";
import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/components/advanced-tables/utils/data-table";
import { generateId } from "@/components/advanced-tables/utils/id";
import { getFiltersStateParser } from "@/components/advanced-tables/utils/parsers";

const FILTERS_KEY = "filters";
const JOIN_OPERATOR_KEY = "joinOperator";
const PAGE_KEY = "page";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const OPEN_MENU_SHORTCUT = "f";
const REMOVE_FILTER_SHORTCUTS = ["backspace", "delete"];

interface DataTableFilterListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
}

export function DataTableFilterList<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  ...props
}: DataTableFilterListProps<TData>) {
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);
  const tTable = useTranslations("Tables");
  const getAllColumns = table.getAllColumns();

  const columns = React.useMemo(() => {
    return getAllColumns.filter(
      (column) => column.columnDef.enableColumnFilter
    );
  }, [getAllColumns]);

  const filtersParser = React.useMemo(() => {
    return getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
        throttleMs,
      });
  }, [columns, shallow, throttleMs]);

  const [filters, setFilters] = useQueryState(FILTERS_KEY, filtersParser);

  const [localFilters, setLocalFilters] = React.useState<
    ExtendedColumnFilter<TData>[]
  >([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  React.useEffect(() => {
    const currentFilters = filters || [];
    setLocalFilters(currentFilters);
    setHasUnsavedChanges(false);
  }, [filters]);

  // Détecter les changements non sauvegardés
  React.useEffect(() => {
    const currentFilters = filters || [];
    const hasChanges =
      JSON.stringify(localFilters) !== JSON.stringify(currentFilters);
    setHasUnsavedChanges(hasChanges);
  }, [localFilters, filters]);

  const [joinOperator, setJoinOperator] = useQueryState(
    JOIN_OPERATOR_KEY,
    parseAsStringEnum(["and", "or"]).withDefault("and").withOptions({
      clearOnDefault: true,
      shallow,
    })
  );

  const [page, setPage] = useQueryState(PAGE_KEY, {
    parse: (value) => {
      const num = Number(value);
      return isNaN(num) || num < 1 ? 1 : num;
    },
    serialize: (value) => String(value ?? 1),
    defaultValue: 1,
    clearOnDefault: true,
    shallow,
    throttleMs: 50,
  });

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];

    if (!column) return;

    const newFilter = {
      id: column.id as Extract<keyof TData, string>,
      value: "",
      variant: column.columnDef.meta?.variant ?? "text",
      operator: getDefaultFilterOperator(
        column.columnDef.meta?.variant ?? "text"
      ),
      filterId: generateId({ length: 8 }),
    };

    setLocalFilters((prev) => [...prev, newFilter]);
    setHasUnsavedChanges(true);
  }, [columns]);

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
    ) => {
      setLocalFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
          }
          return filter;
        });
        return updatedFilters;
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  const onFilterRemove = React.useCallback((filterId: string) => {
    setLocalFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter(
        (filter) => filter.filterId !== filterId
      );
      return updatedFilters;
    });
    setHasUnsavedChanges(true);
    requestAnimationFrame(() => {
      addButtonRef.current?.focus();
    });
  }, []);

  const onFiltersReset = React.useCallback(() => {
    setLocalFilters([]);
    setHasUnsavedChanges(true);
    setPage(1);
    setFilters([]);
    setHasUnsavedChanges(false);
  }, [setFilters, setPage]);

  const onFiltersApply = React.useCallback(() => {
    setPage(1);
    setFilters(localFilters);
    setHasUnsavedChanges(false);
  }, [localFilters, setFilters, setPage]);

  const onFiltersCancel = React.useCallback(() => {
    const currentFilters = filters || [];
    setLocalFilters(currentFilters);
    setHasUnsavedChanges(false);
    setOpen(false);
  }, [filters]);

  // Stabiliser les callbacks pour éviter les re-créations
  const stableOnFilterRemove = React.useCallback(
    (filterId: string) => {
      onFilterRemove(filterId);
    },
    [onFilterRemove]
  );

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        setOpen(true);
      }

      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        event.shiftKey &&
        localFilters.length > 0
      ) {
        event.preventDefault();
        const lastFilter = localFilters[localFilters.length - 1];
        if (lastFilter) {
          stableOnFilterRemove(lastFilter.filterId);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [localFilters, stableOnFilterRemove]);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        localFilters.length > 0
      ) {
        event.preventDefault();
        const lastFilter = localFilters[localFilters.length - 1];
        if (lastFilter) {
          stableOnFilterRemove(lastFilter.filterId);
        }
      }
    },
    [localFilters, stableOnFilterRemove]
  );

  return (
    <Sortable
      value={localFilters}
      onValueChange={setLocalFilters}
      getItemValue={(item) => item.filterId}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            size="sm"
            onKeyDown={onTriggerKeyDown}
            title={
              hasUnsavedChanges ? tTable("unsaved_changes") : tTable("filters")
            }
            className={cn(
              "h-8 gap-2",
              hasUnsavedChanges &&
                "border border-orange-600 bg-orange-200 text-orange-700 hover:bg-orange-100"
            )}
          >
            <ListFilter size={16} />
            {tTable("filters")}
            {localFilters.length > 0 && (
              <Badge
                variant="none"
                className={cn(
                  "bg-primary-foreground text-primary h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono text-[10.4px] font-normal",
                  hasUnsavedChanges && "bg-orange-600 text-white"
                )}
              >
                {localFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          className="flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3.5 p-4 sm:min-w-[380px]"
          {...props}
        >
          <div className="flex flex-col gap-1">
            <h4 id={labelId} className="font-medium leading-none">
              {localFilters.length > 0
                ? tTable("filters")
                : tTable("no_filters_applied")}
            </h4>
            <p
              id={descriptionId}
              className={cn(
                "text-muted-foreground text-sm",
                localFilters.length > 0 && "sr-only"
              )}
            >
              {localFilters.length > 0
                ? tTable("modify_filters_to_refine_your_rows")
                : tTable("add_filters_to_refine_your_rows")}
            </p>
          </div>
          {localFilters.length > 0 ? (
            <SortableContent asChild>
              <div
                role="list"
                className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1"
              >
                {localFilters.map((filter, index) => (
                  <DataTableFilterItem<TData>
                    key={filter.filterId}
                    filter={filter}
                    index={index}
                    filterItemId={`${id}-filter-${filter.filterId}`}
                    joinOperator={joinOperator}
                    setJoinOperator={setJoinOperator}
                    columns={columns}
                    onFilterUpdate={onFilterUpdate}
                    onFilterRemove={stableOnFilterRemove}
                  />
                ))}
              </div>
            </SortableContent>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            className="-mt-2 h-8 rounded"
            ref={addButtonRef}
            onClick={onFilterAdd}
          >
            <Plus className="size-4" />
          </Button>
          <div className="flex w-full items-center justify-end gap-2">
            {localFilters.length > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded"
                  onClick={onFiltersReset}
                >
                  {tTable("reset")}
                </Button>
                {hasUnsavedChanges && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded"
                      onClick={onFiltersCancel}
                    >
                      {tTable("cancel")}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 rounded"
                      onClick={onFiltersApply}
                    >
                      {tTable("confirm")}
                    </Button>
                  </>
                )}
              </>
            ) : (
              filters &&
              filters.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded"
                    onClick={onFiltersCancel}
                  >
                    {tTable("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 rounded"
                    onClick={onFiltersApply}
                  >
                    {tTable("confirm")}
                  </Button>
                </>
              )
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 h-8 min-w-[72px] rounded-sm" />
          <div className="bg-primary/10 h-8 w-32 rounded-sm" />
          <div className="bg-primary/10 h-8 w-32 rounded-sm" />
          <div className="bg-primary/10 h-8 min-w-36 flex-1 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperator;
  setJoinOperator: (value: JoinOperator) => void;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: DataTableFilterItemProps<TData>) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);
  const locale = useLocale();
  const localeToUse = locale === "fr" ? fr : en;

  const column = columns.find((column) => column.id === filter.id);

  const joinOperatorListboxId = `${filterItemId}-join-operator-listbox`;
  const fieldListboxId = `${filterItemId}-field-listbox`;
  const operatorListboxId = `${filterItemId}-operator-listbox`;
  const inputId = `${filterItemId}-input`;
  const tTable = useTranslations("Tables");
  const columnMeta = column?.columnDef.meta;
  const filterOperators = getFilterOperators(filter.variant);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showFieldSelector || showOperatorSelector || showValueSelector) {
        return;
      }

      if (REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault();
        onFilterRemove(filter.filterId);
      }
    },
    [
      filter.filterId,
      showFieldSelector,
      showOperatorSelector,
      showValueSelector,
      onFilterRemove,
    ]
  );

  if (!column) return null;

  return (
    <SortableItem value={filter.filterId} asChild>
      <div
        role="listitem"
        id={filterItemId}
        tabIndex={-1}
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        <div className="min-w-[72px] text-center">
          {index === 0 ? (
            <span className="text-muted-foreground text-sm">
              {tTable("where")}
            </span>
          ) : index === 1 ? (
            <Select
              value={joinOperator}
              onValueChange={(value: JoinOperator) => setJoinOperator(value)}
            >
              <SelectTrigger
                aria-label="Select join operator"
                aria-controls={joinOperatorListboxId}
                className="h-8 rounded lowercase [&[data-size]]:h-8"
              >
                <SelectValue placeholder={joinOperator} />
              </SelectTrigger>
              <SelectContent
                id={joinOperatorListboxId}
                position="popper"
                className="min-w-(--radix-select-trigger-width) z-[9999] lowercase"
              >
                {dataTableConfig.joinOperators.map((joinOperator) => (
                  <SelectItem key={joinOperator} value={joinOperator}>
                    {joinOperator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-muted-foreground text-sm">
              {joinOperator}
            </span>
          )}
        </div>
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-controls={fieldListboxId}
              variant="outline"
              size="sm"
              className="h-8 w-32 justify-start gap-2 rounded font-normal "
            >
              <div className="text-muted-foreground scale-[0.85]">
                {column.columnDef.meta?.icon
                  ? (column.columnDef.meta?.icon as unknown as React.ReactNode)
                  : null}
              </div>
              <span className="truncate">
                {tTable(
                  columns.find((column) => column.id === filter.id)
                    ?.id as keyof MessagesIntl
                )}
              </span>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            align="start"
            className="w-40 origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Command>
              <CommandInput placeholder="..." />
              <CommandList>
                <CommandEmpty>{tTable("no_fields_found")}</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => {
                    if (column.columnDef.meta?.onlyBasicFilter) return null;
                    return (
                      <CommandItem
                        key={column.id}
                        value={column.id}
                        className="flex items-center gap-2"
                        onSelect={(value) => {
                          onFilterUpdate(filter.filterId, {
                            id: value as Extract<keyof TData, string>,
                            variant: column.columnDef.meta?.variant ?? "text",
                            operator: getDefaultFilterOperator(
                              column.columnDef.meta?.variant ?? "text"
                            ),
                            value: "",
                          });
                          setShowFieldSelector(false);
                        }}
                      >
                        <div className="text-muted-foreground scale-[0.85]">
                          {column.columnDef.meta?.icon
                            ? (column.columnDef.meta
                                ?.icon as unknown as React.ReactNode)
                            : null}
                        </div>
                        <span className="truncate">
                          {tTable(column.id as keyof MessagesIntl)}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            column.id === filter.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          open={showOperatorSelector}
          onOpenChange={setShowOperatorSelector}
          value={filter.operator}
          onValueChange={(value: FilterOperator) =>
            onFilterUpdate(filter.filterId, {
              operator: value,
              value:
                value === "isEmpty" || value === "isNotEmpty"
                  ? ""
                  : filter.value,
            })
          }
        >
          <SelectTrigger
            aria-controls={operatorListboxId}
            className="h-8 w-24 rounded lowercase [&[data-size]]:h-8"
          >
            <div className="truncate">
              <SelectValue placeholder={filter.operator}>
                <span className="text-xs font-medium text-purple-600">
                  [{" "}
                  {
                    filterOperators.find(
                      (operator) => operator.value === filter.operator
                    )?.operator
                  }{" "}
                  ]
                </span>{" "}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent
            id={operatorListboxId}
            className="z-[9999] origin-[var(--radix-select-content-transform-origin)]"
          >
            {filterOperators.map((operator) => (
              <SelectItem
                key={operator.value}
                value={operator.value}
                className="lowercase"
              >
                <span className="text-xs font-medium text-purple-600">
                  [ {operator.operator} ]
                </span>{" "}
                {tTable(operator.label as keyof MessagesIntl)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="min-w-36 flex-1">
          {onFilterInputRender({
            filter,
            inputId,
            column,
            columnMeta,
            onFilterUpdate,
            showValueSelector,
            setShowValueSelector,
            localeToUse,
            tTable,
          })}
        </div>
        <Button
          aria-controls={filterItemId}
          variant="destructive"
          size="icon"
          className="size-8 rounded"
          onClick={() => onFilterRemove(filter.filterId)}
        >
          <Trash2 className="size-4" />
        </Button>
        <SortableItemHandle asChild>
          <Button variant="outline" size="icon" className="size-8 rounded">
            <GripVertical className="size-4" />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  );
}

function onFilterInputRender<TData>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
  localeToUse,
  tTable,
}: {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData>;
  columnMeta?: ColumnMeta<TData, unknown>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
  localeToUse: Locale;
  tTable: MessagesIntl;
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        role="status"
        aria-label={`${columnMeta?.label} filter is ${
          filter.operator === "isEmpty" ? "empty" : "not empty"
        }`}
        aria-live="polite"
        className="dark:bg-input/30 h-8 w-full rounded border bg-transparent"
      />
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "uuid":
    case "range": {
      if (
        (filter.variant === "range" && filter.operator === "isBetween") ||
        filter.operator === "isBetween"
      ) {
        return (
          <DataTableRangeFilter
            filter={filter}
            column={column}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }

      const isNumber =
        filter.variant === "number" || filter.variant === "range";

      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : filter.variant}
          aria-label={`${columnMeta?.label} filter value`}
          aria-describedby={`${inputId}-description`}
          inputMode={isNumber ? "numeric" : undefined}
          placeholder={columnMeta?.placeholder ?? "..."}
          className="hover:border-primary h-8 w-full rounded hover:border"
          defaultValue={
            typeof filter.value === "string" ? filter.value : undefined
          }
          onChange={(event) =>
            onFilterUpdate(filter.filterId, {
              value: event.target.value,
            })
          }
        />
      );
    }

    case "boolean": {
      if (Array.isArray(filter.value)) return null;

      const inputListboxId = `${inputId}-listbox`;

      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={filter.value}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, {
              value,
            })
          }
        >
          <SelectTrigger
            id={inputId}
            aria-controls={inputListboxId}
            aria-label={`${columnMeta?.label} boolean filter`}
            className="h-8 w-full rounded [&[data-size]]:h-8"
          >
            <SelectValue
              placeholder={filter.value ? tTable("yes") : tTable("no")}
            />
          </SelectTrigger>
          <SelectContent id={inputListboxId} className="z-[9999]">
            <SelectItem value="true">{tTable("yes")}</SelectItem>
            <SelectItem value="false">{tTable("no")}</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const inputListboxId = `${inputId}-listbox`;

      const multiple = filter.variant === "multiSelect";
      const selectedValues = multiple
        ? Array.isArray(filter.value)
          ? filter.value
          : []
        : typeof filter.value === "string"
          ? filter.value
          : undefined;

      return (
        <Faceted
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={selectedValues}
          onValueChange={(value) => {
            onFilterUpdate(filter.filterId, {
              value,
            });
          }}
          multiple={multiple}
        >
          <FacetedTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${columnMeta?.label} filter value${multiple ? "s" : ""}`}
              variant="outline"
              size="sm"
              className="h-8 w-full rounded font-normal"
            >
              <FacetedBadgeList
                options={columnMeta?.options}
                placeholder={columnMeta?.placeholder ?? "..."}
              />
            </Button>
          </FacetedTrigger>
          <FacetedContent
            id={inputListboxId}
            className="w-[200px] origin-[var(--radix-popover-content-transform-origin)]"
          >
            <FacetedInput
              aria-label={`${tTable("search")} ${columnMeta?.label} ${tTable("options")}`}
              placeholder={columnMeta?.placeholder ?? "..."}
            />
            <FacetedList>
              <FacetedEmpty>{tTable("no-results")}</FacetedEmpty>
              <FacetedGroup>
                {columnMeta?.options?.map((option) => (
                  <FacetedItem key={option.value} value={option.value}>
                    {option.icon && <option.icon className="mr-2 size-4" />}
                    <span>{option.label}</span>
                    {option.count && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </FacetedItem>
                ))}
              </FacetedGroup>
            </FacetedList>
          </FacetedContent>
        </Faceted>
      );
    }

    case "date":
    case "dateRange": {
      const inputListboxId = `${inputId}-listbox`;

      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);

      const displayValue =
        filter.operator === "isBetween" && dateValue.length === 2
          ? `${formatDate(new Date(Number(dateValue[0])))} - ${formatDate(
              new Date(Number(dateValue[1]))
            )}`
          : dateValue[0]
            ? formatDate(new Date(Number(dateValue[0])))
            : tTable("pick_a_date");

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${columnMeta?.label} date filter`}
              variant="outline"
              size="sm"
              className={cn(
                "h-8 w-full justify-start gap-2 rounded text-left font-normal",
                !filter.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon size={16} />
              <span className="truncate">{displayValue}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align="start"
            className="w-auto origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            {filter.operator === "isBetween" ? (
              <Calendar
                aria-label={`Select ${columnMeta?.label} date range`}
                mode="range"
                captionLayout="dropdown-buttons"
                locale={localeToUse}
                numberOfMonths={2}
                fromYear={2018}
                toYear={new Date().getFullYear() + 100}
                initialFocus
                selected={
                  dateValue.length === 2
                    ? {
                        from: new Date(Number(dateValue[0])),
                        to: new Date(Number(dateValue[1])),
                      }
                    : {
                        from: new Date(),
                        to: new Date(),
                      }
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                          (date.from?.getTime() ?? "").toString(),
                          (date.to?.getTime() ?? "").toString(),
                        ]
                      : [],
                  });
                }}
              />
            ) : (
              <Calendar
                aria-label={`Select ${columnMeta?.label} date`}
                mode="single"
                initialFocus
                captionLayout="dropdown-buttons"
                locale={localeToUse}
                numberOfMonths={2}
                fromYear={2018}
                toYear={new Date().getFullYear() + 100}
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : undefined
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: (date?.getTime() ?? "").toString(),
                  });
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}
