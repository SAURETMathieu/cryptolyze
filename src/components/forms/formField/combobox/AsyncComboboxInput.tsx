"use client";

import { useEffect, useState, type JSX } from "react";
import { cn } from "@/src/lib/utils";
import { ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LabelSection } from "@/components/forms/layout/LabelSection";

import { DynamicSearchTemplate } from "./search/DynamicSearchTemplate";
import { FetchResultsResponse } from "./search/Search";

interface Identifiable {
  id: string | number;
  [key: string]: any;
}

type CustomerInputProps<T extends Identifiable> = {
  form: any;
  name: string;
  inputClassName?: string;
  itemClassName?: string;
  containerClassName?: string;
  label: string;
  placeholder?: string;
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  skeletonItems?: JSX.Element;
  AddButton?: JSX.Element;
  required?: boolean;
  isPending?: boolean;
  handleResetField?: () => void;
  handleChange?: (item: T) => void;
  compareFn?: (a: T, b: T) => boolean;
  defaultSelected?: T;
  defaultFetch?: (query?: string) => Promise<FetchResultsResponse<T[]>>;
  variableToStore?: string;
};

export function AsyncComboboxInput<T extends Identifiable>({
  form,
  name,
  inputClassName,
  itemClassName,
  containerClassName,
  label,
  placeholder = "Select...",
  fetchResults,
  renderItem,
  skeletonItems,
  AddButton,
  required = true,
  isPending = false,
  handleResetField,
  handleChange = () => {},
  compareFn,
  defaultSelected = undefined,
  defaultFetch,
  variableToStore = "id",
}: CustomerInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(defaultSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<T[]>([]);
  const formValue = form.watch(name);

  const defaultHandleResetField = () => {
    form.setValue(name, defaultSelected?.[variableToStore]?.toString());
    setSelected(defaultSelected);
  };

  useEffect(() => {
    if (formValue) {
      if (formValue === defaultSelected?.[variableToStore]?.toString()) {
        setSelected(defaultSelected);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  const handleRemoveField = () => {
    form.setValue(name, undefined);
    setSelected(undefined);
  };

  useEffect(() => {
    if (defaultFetch) {
      defaultFetch().then((res) => {
        setDatas(res.data);
      });
    }
  }, [defaultFetch]);

  handleResetField = handleResetField || defaultHandleResetField;

  const handleChangeDefault = (item: T) => {
    handleChange(item);
    setSelected(item);
    form.setValue(name, item[variableToStore]?.toString());
    setIsOpen && setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-full justify-between gap-2",
        containerClassName
      )}
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem
            className={cn(
              "w-full",
              !!renderItem && "w-[calc(100%-46px)]",
              itemClassName
            )}
          >
            <LabelSection label={label} required={required} />
            <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between truncate",
                      !field.value && "text-muted-foreground",
                      inputClassName
                    )}
                    {...field}
                    disabled={isPending}
                  >
                    {field.value ? (
                      renderItem(selected as T)
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    {field.value ? (
                      <X
                        className="ml-2 size-4 shrink-0 opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveField();
                        }}
                      />
                    ) : (
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <DynamicSearchTemplate
                  form={form}
                  name={name}
                  fetchResults={fetchResults}
                  handleSelectItem={handleChangeDefault}
                  setIsOpen={setIsOpen}
                  setSelected={setSelected}
                  selected={selected}
                  renderItem={renderItem}
                  compareFn={compareFn}
                  skeletonItems={skeletonItems}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  datas={datas}
                  setDatas={setDatas}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      {AddButton ? <>{AddButton}</> : null}
    </div>
  );
}
