import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { cn } from "@/src/lib/utils";
import { ShieldAlert } from "lucide-react";

interface CustomAlertProps {
  message: string | React.ReactNode;
  variant?: "red" | "default" | "destructive" | "orange" | "green" | "blue";
  icon?: React.ReactNode;
  className?: string;
  descriptionClassName?: string;
  iconClassName?: string;
}

export default function CustomAlert({
  message,
  variant = "red",
  icon,
  className,
  descriptionClassName,
  iconClassName,
}: CustomAlertProps) {
  return (
    <Alert
      variant={variant}
      className={cn(
        "mx-auto my-4 flex max-w-screen-xl items-center p-6",
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <ShieldAlert
          size={24}
          className={cn(
            "text-foreground absolute left-2 top-1/2 -translate-y-1/2",
            iconClassName
          )}
        />
      )}
      <AlertDescription
        className={cn("mt-1 items-center text-base", descriptionClassName)}
      >
        {message}
      </AlertDescription>
    </Alert>
  );
}
