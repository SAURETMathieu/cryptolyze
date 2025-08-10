import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormCustomNumber({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;

  let quantity = fieldProps.value || 1;

  const handleIncrease = () => {
    const currentQuantity = parseInt(quantity, 10);
    if (!isNaN(currentQuantity)) {
      if (currentQuantity < 99) {
        quantity = currentQuantity + 1;
      } else {
        quantity = 1;
      }
    } else {
      quantity = 1;
    }
    fieldProps.onChange(quantity);
  };

  const handleDecrease = () => {
    const currentQuantity = parseInt(quantity, 10);

    if (!isNaN(currentQuantity)) {
      if (currentQuantity > 1) {
        quantity = currentQuantity - 1;
      } else {
        quantity = 99;
      }
    } else {
      quantity = 99;
    }
    fieldProps.onChange(quantity);
  };

  return (
    <FormItem>
      {showLabel && (
        <div>
          {fieldConfigItem?.label || label}
          {isRequired && <span className="text-destructive"> *</span>}
        </div>
      )}
      <FormControl>
        <div className="bg-background mx-auto flex h-[60px] w-full max-w-[180px] justify-center gap-2 rounded-lg border p-2">
          <Button
            variant="outline"
            size={"icon"}
            className="hover:bg-primary hover:text-primary-foreground rounded-lg p-2"
            type="button"
            onClick={handleDecrease}
          >
            <Minus />
          </Button>
          <Input
            type="number"
            className="hover:ring-ring max-w-16 text-center hover:ring-1"
            {...fieldPropsWithoutShowLabel}
          />
          <Button
            variant="outline"
            size={"icon"}
            className="hover:bg-primary hover:text-primary-foreground rounded-lg p-2"
            type="button"
            onClick={handleIncrease}
          >
            <Plus />
          </Button>
        </div>
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
