"use client";

import { useEffect, useState, type JSX } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import InfiniteScroll from "@/src/components/ui/infinite-scroll";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import { CheckIcon, ChevronsUpDown, Loader, X, XIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FetchResultsResponse } from "@/components/forms/formField/combobox/search/Search";

interface Identifiable {
  id: string | number;
}

interface AsyncComboboxSearchProps<T extends Identifiable> {
  placeholder?: string;
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  skeletonItems?: JSX.Element;
  handleResetField?: () => void;
  handleChange?: (item: T) => void;
  compareFn?: (a: T, b: T) => boolean;
  defaultSelected?: T;
  defaultFetch?: (query: string) => Promise<FetchResultsResponse<T[]>>;
}

export default function AsyncComboboxSearch<T extends Identifiable>({
  placeholder = "Select...",
  fetchResults,
  renderItem,
  skeletonItems,
  handleResetField,
  handleChange = () => {},
  compareFn,
  defaultSelected = undefined,
}: AsyncComboboxSearchProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(defaultSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<T[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [itemsToShow, setItemsToShow] = useState(30);

  const handleValueChange = (item: T) => {
    setSelected(item);
    handleChange && handleChange(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    if (!debouncedSearchQuery) {
      setDatas([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setDatas([]);
      setVisibleItems([]);
      try {
        const { data, success, message } =
          await fetchResults(debouncedSearchQuery);
        setDatas(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const loadMoreItems = () => {
    if (datas.length > visibleItems.length) {
      setVisibleItems((prev) => [
        ...prev,
        ...datas.slice(prev.length, prev.length + itemsToShow),
      ]);
    }
  };

  compareFn = compareFn || ((a: T, b: T) => a?.id === b?.id);

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between truncate",
            !selected && "text-muted-foreground"
          )}
        >
          {selected ? renderItem(selected) : <span>{placeholder}</span>}
          {selected ? (
            <X
              className="ml-2 size-4 shrink-0 opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(undefined);
                handleResetField && handleResetField();
              }}
            />
          ) : (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          shouldFilter={false}
          className="h-auto rounded-lg border border-b-0 shadow-md"
        >
          <div className="relative">
            <CommandInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder={placeholder}
            />
            {searchQuery && (
              <Button
                className="absolute right-2 top-1/2 h-fit -translate-y-1/2 p-0 hover:bg-transparent"
                onClick={() => {
                  setSearchQuery("");
                  setDatas([]);
                  setVisibleItems([]);
                }}
                type="button"
                variant="ghost"
              >
                <XIcon className="text-muted-foreground size-4" />
              </Button>
            )}
          </div>
          {!isLoading && <CommandEmpty>Pas de resultat.</CommandEmpty>}
          <CommandList>
            <ScrollArea className="max-h-72 w-full overflow-y-auto">
              <CommandGroup>
                {isLoading &&
                  (skeletonItems ? (
                    skeletonItems
                  ) : (
                    <div className="p-4 text-sm">Recherche...</div>
                  ))}
                {isError && (
                  <div className="p-4 text-sm">
                    Une erreur s&apos;est produite
                  </div>
                )}

                {visibleItems.map((item) => (
                  <CommandItem
                    key={item.id as string}
                    onSelect={() => handleValueChange(item)}
                    className={cn(
                      "gap-2",
                      compareFn(item, selected!) && "bg-muted"
                    )}
                  >
                    <div
                      className="flex w-full items-center justify-between gap-2"
                      onClick={() => handleValueChange(item)}
                    >
                      <CheckIcon
                        className={cn(
                          "size-4",
                          compareFn(item, selected!)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {renderItem(item)}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <InfiniteScroll
                isLoading={isLoading}
                hasMore={visibleItems.length < datas.length}
                next={loadMoreItems}
                threshold={1}
              >
                {visibleItems.length < datas.length && (
                  <Loader className="mx-auto my-2 size-8 animate-spin " />
                )}
              </InfiniteScroll>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
