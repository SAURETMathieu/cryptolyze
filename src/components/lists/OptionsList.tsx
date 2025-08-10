import { cn } from "@/src/lib/utils";
import { getOptionsIconAndStyle } from "@/src/utils/getFilterOptions/getOptionsIconAndStyle";

import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function OptionsList({
  options,
  t,
  locale,
}: {
  options: Partial<Database["erp"]["Tables"]["order_item_options"]["Row"]>[];
  t?: any;
  locale?: string;
}) {
  return (
    <>
      {options && options.length > 0
        ? options.map((option) => {
            const { icon, style } = getOptionsIconAndStyle(option?.type!);
            return (
              <TooltipProvider key={option.type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="primary"
                      size="icon"
                      className={cn(
                        "text-md rounded-lg px-1 capitalize",
                        style
                      )}
                    >
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border-primary/70 bg-muted rounded-lg border p-3 shadow-md">
                    <div className="flex w-full flex-col items-center justify-between gap-1">
                      <Button
                        variant="primary"
                        size="icon"
                        className={cn(
                          "text-md rounded-lg px-1 capitalize",
                          style
                        )}
                      >
                        {icon}
                      </Button>
                      <h4 className="text-md font-bold capitalize">
                        {t
                          ? locale
                            ? t(option.type, locale)
                            : t(option.type)
                          : option.type}
                      </h4>
                      <span className="">{option.price_ttc} €</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })
        : "---"}
    </>
  );
}
