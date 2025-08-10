import { useEffect, useState } from "react";
import { getUsersByEmail } from "@/src/app/actions/admin/users";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { CheckIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import { UsersByEmail } from "@/types/admin/users";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchProps {
  selectedResult?: UsersByEmail;
  onSelectResult: (user: UsersByEmail) => void;
}

export function Search({ selectedResult, onSelectResult }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectResult = (user: UsersByEmail) => {
    onSelectResult(user);
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandList>
        <ScrollArea className="max-h-72">
          <CommandInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search users by email"
          />
          <CommandEmpty>No user found.</CommandEmpty>
          <SearchResults
            query={searchQuery}
            selectedResult={selectedResult}
            onSelectResult={handleSelectResult}
          />
        </ScrollArea>
      </CommandList>
    </Command>
  );
}

interface SearchResultsProps {
  query: string;
  selectedResult?: UsersByEmail;
  onSelectResult: (user: UsersByEmail) => void;
}

function SearchResults({
  query,
  selectedResult,
  onSelectResult,
}: SearchResultsProps) {
  const [debouncedSearchQuery] = useDebounce(query, 100);
  const [data, setData] = useState<UsersByEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await getUsersByEmail(debouncedSearchQuery, false);
        setData(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery]);

  const enabled = !!debouncedSearchQuery;

  if (!enabled) return null;

  return (
    <CommandGroup>
      {isLoading && <div className="p-4 text-sm">Recherche...</div>}
      {isError && (
        <div className="p-4 text-sm">Une erreur s&apos;est produite</div>
      )}

      {data?.map(({ id, email }) => {
        return (
          <CommandItem
            key={id}
            onSelect={() => onSelectResult({ id, email })}
            value={email}
            className="gap-2"
          >
            {email}
            <CheckIcon
              className={cn(
                "ml-auto size-4",
                selectedResult?.id === id ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}
