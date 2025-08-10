"use client";

import { useEffect, useState, type JSX } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import InfiniteScroll from "@/src/components/ui/infinite-scroll";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Loader, Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FetchResultsResponse } from "@/components/forms/formField/combobox/search/Search";

import { Input } from "./input";

interface Identifiable {
  id: string | number;
}

interface AsyncSearchBarProps<T extends Identifiable> {
  placeholder?: string;
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  skeletonItems?: JSX.Element;
}

export default function AsyncSearchBar<T extends Identifiable>({
  placeholder = "Select...",
  fetchResults,
  renderItem,
  skeletonItems,
}: AsyncSearchBarProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<T[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [itemsToShow, setItemsToShow] = useState(30);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setDatas([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setDatas([]);
      setVisibleItems([]);
      setIsOpen(true);
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

  useEffect(() => {
    if (!isOpen) {
      setVisibleItems(datas.slice(0, itemsToShow));
    }
  }, [isOpen, datas, itemsToShow]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (searchQuery) {
          setIsOpen(open);
        } else {
          setIsOpen(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
          <Input
            type="search"
            placeholder={placeholder}
            className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[336px] p-0">
        <Command
          shouldFilter={false}
          className="h-auto rounded-lg border border-b-0 shadow-md"
        >
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
                  <CommandItem key={item.id as string} className="gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
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
