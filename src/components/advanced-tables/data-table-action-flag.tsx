import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { flagConfig } from "./config/flag";
import { useFeatureFlags } from "./utils/feature-flags-provider";

export function DataTableActionFlag() {
  const { filterFlag, onFilterFlagChange } = useFeatureFlags();
  return (
    <div className="w-full overflow-x-auto">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={filterFlag}
        onValueChange={onFilterFlagChange}
        className="w-fit"
      >
        {flagConfig.featureFlags.map((flag) => (
          <TooltipProvider key={flag.value}>
            <Tooltip delayDuration={700}>
              <ToggleGroupItem
                value={flag.value}
                className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground/90 h-8 whitespace-nowrap rounded-md border px-3 text-xs"
                asChild
              >
                <TooltipTrigger>
                  <flag.icon className="size-3.5 shrink-0" />
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent
                align="start"
                side="bottom"
                sideOffset={6}
                className="bg-background text-foreground flex flex-col gap-1.5 border py-2 font-semibold [&>span]:hidden"
              >
                <div>{flag.tooltipTitle}</div>
                <p className="text-muted-foreground text-balance text-xs">
                  {flag.tooltipDescription}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </ToggleGroup>
    </div>
  );
}
