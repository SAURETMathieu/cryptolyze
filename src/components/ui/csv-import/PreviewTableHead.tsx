"use client";

import { useId, useState } from "react";
import { useModal } from "@/src/context/modalProvider";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { CommandList } from "cmdk";
import { ArrowDownIcon, InfoIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableHead } from "@/components/ui/table";

interface PreviewTableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  field: {
    label: string;
    value: string;
    required?: boolean;
    default?: string;
    infos?: React.ReactNode;
  };
  onFieldChange: (props: { value: string; required?: boolean }) => void;
  onFieldToggle: (props: { value: string; checked: boolean }) => void;
  currentFieldMapping: string | undefined;
  originalFieldMappings: Record<string, string | undefined>;
}

export function PreviewTableHead({
  field,
  onFieldChange,
  onFieldToggle,
  currentFieldMapping,
  originalFieldMappings,
  className,
  ...props
}: PreviewTableHeadProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { openModal, setTitle } = useModal();
  const tTable = useTranslations("Tables");

  return (
    <TableHead
      className={cn("relative whitespace-nowrap py-3", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="text-primary h-7 w-full min-w-36 max-w-48 justify-between text-xs font-normal"
            >
              {currentFieldMapping || "Select field..."}
              <div className="flex items-center gap-1">
                {currentFieldMapping && (
                  <X
                    className="hover:text-destructive size-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFieldChange({ value: "" });
                    }}
                  />
                )}
                <CaretSortIcon className="ml-1 size-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput className="h-9" placeholder="Search field..." />
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandGroup>
                  {[...new Set(Object.values(originalFieldMappings))].map(
                    (fm) => (
                      <CommandItem
                        key={fm}
                        value={fm}
                        onSelect={() => {
                          onFieldChange({
                            value: fm ?? "",
                          });
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4",
                            currentFieldMapping === fm
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="line-clamp-1">{fm}</span>
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <ArrowDownIcon className="size-4" aria-hidden="true" />
        <div className="flex items-center gap-1">
          <Label htmlFor={`${id}-${field.value}`} className="truncate">
            {field.label}
          </Label>
          {field.required ? (
            <span className="text-md text-destructive">*</span>
          ) : (
            <span className="text-md text-muted-foreground">
              ({field.default})
            </span>
          )}
          {field.infos && (
            <Button
              variant="ghost"
              className="absolute bottom-2 right-2 size-5 p-0 hover:bg-transparent hover:text-yellow-500"
            >
              <InfoIcon
                className="size-4"
                onClick={() => {
                  setTitle(
                    tTable("csv_import_informations", { label: field.label })
                  );
                  openModal(field.infos);
                }}
              />
            </Button>
          )}
        </div>
      </div>
    </TableHead>
  );
}
