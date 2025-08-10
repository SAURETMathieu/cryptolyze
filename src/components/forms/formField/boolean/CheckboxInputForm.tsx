import { Checkbox } from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { cn } from "@/src/lib/utils";

import { LabelSection } from "@/components/forms/layout/LabelSection";

interface CheckboxInputProps {
  form: any; // react-hook-form control
  name: string;
  label: string | React.ReactNode;
  required?: boolean;
  isPending?: boolean;
  className?: string;
  containerClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
  labelBefore?: boolean;
}

const CheckboxInput = ({
  form,
  name,
  label,
  required = false,
  isPending = false,
  className,
  containerClassName,
  onCheckedChange,
  labelBefore = false,
}: CheckboxInputProps) => {
  const handleCheckedChange = (checked: boolean) => {
    form.setValue(name, checked);
    onCheckedChange && onCheckedChange(checked);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", containerClassName)}>
          <div className="flex items-center space-x-2">
            {labelBefore && <LabelSection label={label} required={required} />}
            <FormControl>
              <Checkbox
                disabled={isPending}
                checked={field.value}
                onCheckedChange={handleCheckedChange}
                className={cn(className)}
              />
            </FormControl>
            {!labelBefore && <LabelSection label={label} required={required} />}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxInput;
