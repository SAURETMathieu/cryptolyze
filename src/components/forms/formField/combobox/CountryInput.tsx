"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import { CountryCode, getCountries } from "libphonenumber-js";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import flags from "react-phone-number-input/flags";
import countries from "react-phone-number-input/locale/fr.json";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabelSection } from "@/components/forms/layout/LabelSection";

export default function CountryInput({
  form,
  required = true,
  placeholder = "Recherche par pays",
  isPending = false,
  name,
  label,
  whitelist,
  blacklist,
}: {
  form: any;
  required?: boolean;
  placeholder?: string;
  isPending?: boolean;
  name: string;
  label: string;
  whitelist?: CountryCode[];
  blacklist?: CountryCode[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const updateWidth = () => {
      setMinWidth(buttonRef.current?.offsetWidth || null);
    };

    updateWidth(); // set initial width

    const resizeObserver = new ResizeObserver(() => {
      updateWidth(); // update when resized
    });

    resizeObserver.observe(buttonRef.current);

    return () => {
      resizeObserver.disconnect(); // clean on unmount
    };
  }, []);

  const [countriesCodes, setCountriesCodes] =
    useState<CountryCode[]>(getCountries());
  const tForms = useTranslations("Forms");

  useEffect(() => {
    const source = whitelist ?? countriesCodes;
    const filteredCountries = source.filter((country) => {
      return !blacklist?.includes(country);
    });
    setCountriesCodes(filteredCountries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedView = (item: string) => {
    const Flag = flags[item as keyof typeof flags];
    const countryName = countries[item as keyof typeof countries];
    return (
      <div className="flex items-center gap-2">
        <span className="mr-2 h-4 w-6">{Flag && <Flag title={item} />}</span>
        <span>{countryName}</span>
      </div>
    );
  };

  const handleResetField = () => {
    form.setValue(name, undefined);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col" ref={buttonRef}>
          <LabelSection label={label || "Langue"} required={required} />
          <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  {...field}
                  disabled={isPending}
                >
                  {field.value
                    ? countriesCodes.find(
                        (coutryCode) => coutryCode === field.value
                      ) && selectedView(field.value)
                    : (placeholder ?? tForms("countryPlaceholder"))}
                  {field.value ? (
                    <X
                      className="ml-2 size-4 shrink-0 opacity-50"
                      onClick={handleResetField}
                    />
                  ) : (
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-full max-w-full p-0")}
              style={{ minWidth: minWidth! }}
            >
              <Command>
                <CommandInput
                  placeholder={placeholder || tForms("countryPlaceholder")}
                />
                <CommandEmpty>{tForms("noResult")}</CommandEmpty>
                <CommandList>
                  <ScrollArea
                    className="max-h-48 overflow-y-auto"
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchMove={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CommandGroup>
                      {countriesCodes.map((item) => {
                        const Flag = flags[item as keyof typeof flags];
                        return (
                          <CommandItem
                            value={countries[item as keyof typeof countries]}
                            key={item}
                            onSelect={() => {
                              form.setValue(name, item);
                              setIsOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                item === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />

                            <span className="mr-2 h-4 w-6">
                              {Flag && <Flag title={item} />}
                            </span>
                            <span className="max-w-[75%] truncate">
                              {countries[item as keyof typeof countries]}
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
